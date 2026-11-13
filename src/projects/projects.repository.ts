import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Колонки проекта, которые читает приложение; profileId нужен загрузчику для раскладки по профилям */
const projectSelect = {
  profileId: true,
  name: true,
  description: true,
  url: true,
} satisfies Prisma.ProjectSelect;

/** Строка проекта из базы: тип выведен из projectSelect */
export type ProjectRecord = Prisma.ProjectGetPayload<{
  select: typeof projectSelect;
}>;

/** Запросы к таблице проектов */
@Injectable()
export class ProjectsRepository {
  constructor(
    private readonly prisma: PrismaService, // клиент базы данных
  ) {}

  /**
   * Пакетная выборка: один запрос на любое число профилей.
   * @param profileIds - id профилей, чьи проекты нужны
   * @returns проекты всех этих профилей одним списком по возрастанию sortOrder;
   *   в каждой строке есть profileId — по нему загрузчик раскладывает строки по родителям
   */
  findByProfileIds(profileIds: readonly number[]): Promise<ProjectRecord[]> {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
      select: projectSelect,
    });
  }
}
