import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Колонки навыка, которые читает приложение; profileId нужен загрузчику для раскладки по профилям */
const skillSelect = {
  profileId: true,
  name: true,
  category: true,
} satisfies Prisma.SkillSelect;

/** Строка навыка из базы: тип выведен из skillSelect */
export type SkillRecord = Prisma.SkillGetPayload<{
  select: typeof skillSelect;
}>;

/** Запросы к таблице навыков */
@Injectable()
export class SkillsRepository {
  constructor(
    private readonly prisma: PrismaService, // клиент базы данных
  ) {}

  /**
   * Пакетная выборка: один запрос на любое число профилей.
   * @param profileIds - id профилей, чьи навыки нужны
   * @returns навыки всех этих профилей одним списком по возрастанию sortOrder;
   *   в каждой строке есть profileId — по нему загрузчик раскладывает строки по родителям
   */
  findByProfileIds(profileIds: readonly number[]): Promise<SkillRecord[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
      select: skillSelect,
    });
  }
}
