import { z } from 'zod';

// Схема переменных окружения: проверяется один раз при старте приложения
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error:
      'ожидается строка подключения вида postgresql://user:pass@host:5432/db',
  }),
  // Писать ли SQL-запросы в журнал: по ним видно число обращений к базе на один запрос GraphQL
  LOG_QUERIES: z.stringbool().default(false),
});

export type Env = z.infer<typeof envSchema>;
