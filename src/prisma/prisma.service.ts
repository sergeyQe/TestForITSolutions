import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Env } from '../config/env.schema.js';
import { PrismaClient } from '../generated/prisma/client.js';

const DATABASE_TIMEOUT_MS = 5_000;

/** Настройки клиента: события о запросах нужны для журнала и для подсчёта запросов в тестах */
type PrismaServiceOptions = {
  adapter: PrismaPg;
  log: [{ emit: 'event'; level: 'query' }];
};

/** Единственный экземпляр клиента Prisma в приложении */
@Injectable()
export class PrismaService
  extends PrismaClient<PrismaServiceOptions>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService<Env, true>) {
    super({
      // Пределы ожидания: зависшая база даёт ошибку (и 503 на /health), а не бесконечное ожидание
      adapter: new PrismaPg({
        connectionString: config.get('DATABASE_URL', { infer: true }),
        connectionTimeoutMillis: DATABASE_TIMEOUT_MS,
        query_timeout: DATABASE_TIMEOUT_MS,
      }),
      log: [{ emit: 'event', level: 'query' }],
    });

    // Журнал SQL-запросов: по нему видно, сколько обращений к базе делает один запрос GraphQL
    if (config.get('LOG_QUERIES', { infer: true })) {
      this.$on('query', (event) => this.logger.debug(event.query));
    }
  }

  async onModuleInit(): Promise<void> {
    // Адаптер открывает соединение только на первом запросе, поэтому доступность базы
    // проверяется запросом: без базы приложение не стартует, а не падает позже
    await this.$queryRaw`SELECT 1`;
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
