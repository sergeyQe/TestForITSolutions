import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.schema.js';

/**
 * Точка входа: создаёт приложение NestJS из AppModule и начинает слушать порт.
 * Параметров нет — порт и адрес базы берутся из проверенных настроек окружения (env.schema.ts).
 * @returns обещание: выполняется, когда сервер начал принимать запросы; отклоняется,
 *   если база недоступна (ошибку ловит блок ниже). Неверные настройки окружения сюда
 *   не доходят: NestJS сам пишет «Config validation error» и завершает процесс
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Ответы не сообщают, на чём написан сервер
  app.disable('x-powered-by');

  // По сигналу остановки контейнера приложение закрывает соединения с базой и завершается само
  app.enableShutdownHooks();

  // Порт берётся из проверенных настроек окружения, а не напрямую из process.env
  const config = app.get(ConfigService<Env, true>);
  await app.listen(config.get('PORT', { infer: true }));
}

try {
  await bootstrap();
} catch (error) {
  // Без базы приложение не стартует: пишет причину и завершается, дальше его перезапускает Docker
  const reason = error instanceof Error ? error.message : String(error);
  new Logger('Bootstrap').error(`Приложение не запустилось: ${reason}`);
  process.exit(1);
}
