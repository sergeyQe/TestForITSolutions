import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/** Проверка состояния для Docker и веб-сервера: приложение живо и база отвечает */
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<{ status: 'ok' }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      // Подробности — в журнал, наружу только факт недоступности
      this.logger.error(error);
      throw new ServiceUnavailableException('База данных недоступна');
    }
    return { status: 'ok' };
  }
}
