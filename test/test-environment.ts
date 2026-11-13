import { execSync } from 'node:child_process';
import { Test } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import request from 'supertest';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

export type QueryResult = {
  /** Тело ответа GraphQL */
  body: unknown;
  /** Сколько SQL-запросов приложение выполнило за этот запрос GraphQL */
  databaseQueries: number;
};

export type TestEnvironment = {
  /** Отдельный клиент для подготовки данных: его запросы в счёт не попадают */
  prisma: PrismaClient;
  /** Выполняет запрос GraphQL по HTTP — тем же путём, что Apollo Sandbox */
  execute(query: string): Promise<QueryResult>;
  stop(): Promise<void>;
};

/**
 * Поднимает всё, что нужно тестам: PostgreSQL в контейнере, схему из миграций и само приложение.
 * От локальной базы разработчика тесты не зависят.
 */
export async function startTestEnvironment(): Promise<TestEnvironment> {
  // Настоящая PostgreSQL той же версии, что в docker-compose
  const container = await new PostgreSqlContainer('postgres:17-alpine').start();
  const databaseUrl = container.getConnectionUri();

  // Схема создаётся теми же миграциями, что и при запуске в Docker
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseUrl, CHECKPOINT_DISABLE: '1' },
    stdio: 'pipe',
  });

  // Приложение берёт настройки из окружения: адрес базы — контейнер, а не база из .env.
  // Пояс западнее Гринвича: форматирование даты не в UTC сдвинуло бы период на предыдущий месяц
  process.env.DATABASE_URL = databaseUrl;
  process.env.LOG_QUERIES = 'false';
  process.env.TZ = 'America/Los_Angeles';

  // Модуль приложения импортируется только теперь: ConfigModule читает окружение в момент импорта
  const { AppModule } = await import('../src/app.module.js');

  // Приложение целиком, как в продакшене: те же модули, без заглушек
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  await app.init();

  // Счётчик запросов к базе: одно событие query клиента Prisma — один SQL-запрос приложения
  let databaseQueries = 0;
  app.get(PrismaService).$on('query', () => {
    databaseQueries += 1;
  });

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  return {
    prisma,

    async execute(query) {
      databaseQueries = 0;
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);
      const body: unknown = response.body;

      // Ответ с ошибками — провал теста: число запросов к базе у такого ответа ничего не значит
      expect(body).not.toHaveProperty('errors');
      return { body, databaseQueries };
    },

    async stop() {
      await app.close();
      await prisma.$disconnect();
      await container.stop();
    },
  };
}
