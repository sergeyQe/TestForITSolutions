import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    // Настройки окружения: при ошибке в переменных приложение не стартует
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    PrismaModule,
  ],
})
export class AppModule {}
