import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Настройки Prisma CLI: где лежит схема и миграции, чем заливать данные и к какой базе подключаться.
// Адрес базы читается из process.env, а не через env() из prisma/config: env() бросает ошибку,
// когда переменной нет, и тогда `prisma generate` не работает там, где база не нужна (сборка образа).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
