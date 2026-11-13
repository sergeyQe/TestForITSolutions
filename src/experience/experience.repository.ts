import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Колонки места работы, которые читает приложение; id нужен для выборки достижений, profileId — загрузчику */
const experienceSelect = {
  id: true,
  profileId: true,
  company: true,
  position: true,
  startDate: true,
  endDate: true,
} satisfies Prisma.ExperienceSelect;

/** Колонки достижения, которые читает приложение; experienceId нужен загрузчику для раскладки по местам работы */
const achievementSelect = {
  experienceId: true,
  text: true,
} satisfies Prisma.AchievementSelect;

/** Строка места работы из базы: тип выведен из experienceSelect */
export type ExperienceRecord = Prisma.ExperienceGetPayload<{
  select: typeof experienceSelect;
}>;
/** Строка достижения из базы: тип выведен из achievementSelect */
export type AchievementRecord = Prisma.AchievementGetPayload<{
  select: typeof achievementSelect;
}>;

/** Запросы к таблицам мест работы и достижений */
@Injectable()
export class ExperienceRepository {
  constructor(
    private readonly prisma: PrismaService, // клиент базы данных
  ) {}

  /**
   * Пакетная выборка: один запрос на любое число профилей.
   * @param profileIds - id профилей, чьи места работы нужны
   * @returns места работы всех этих профилей одним списком по возрастанию sortOrder;
   *   в каждой строке есть profileId — по нему загрузчик раскладывает строки по родителям
   */
  findByProfileIds(profileIds: readonly number[]): Promise<ExperienceRecord[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
      select: experienceSelect,
    });
  }

  /**
   * Пакетная выборка: один запрос на любое число мест работы вместо запроса на каждое (N+1).
   * @param experienceIds - id мест работы, чьи достижения нужны
   * @returns достижения всех этих мест работы одним списком по возрастанию sortOrder;
   *   в каждой строке есть experienceId — по нему загрузчик раскладывает строки по родителям
   */
  findAchievementsByExperienceIds(
    experienceIds: readonly number[],
  ): Promise<AchievementRecord[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { sortOrder: 'asc' },
      select: achievementSelect,
    });
  }
}
