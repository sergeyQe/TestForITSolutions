import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

/** Доступ к базе данных: глобальный модуль, чтобы репозитории не импортировали его каждый раз */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
