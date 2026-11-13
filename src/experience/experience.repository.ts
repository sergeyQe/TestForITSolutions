import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const experienceSelect = {
  id: true,
  profileId: true,
  company: true,
  position: true,
  startDate: true,
  endDate: true,
} satisfies Prisma.ExperienceSelect;

const achievementSelect = {
  experienceId: true,
  text: true,
} satisfies Prisma.AchievementSelect;

export type ExperienceRecord = Prisma.ExperienceGetPayload<{
  select: typeof experienceSelect;
}>;
export type AchievementRecord = Prisma.AchievementGetPayload<{
  select: typeof achievementSelect;
}>;

/** Запросы к таблицам мест работы и достижений */
@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Пакетная выборка: один запрос на любое число профилей */
  findByProfileIds(profileIds: readonly number[]): Promise<ExperienceRecord[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
      select: experienceSelect,
    });
  }

  /** Пакетная выборка: один запрос на любое число мест работы вместо запроса на каждое (N+1) */
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
