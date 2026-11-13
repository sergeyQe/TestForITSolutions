import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const experienceSelect = {
  id: true,
  company: true,
  position: true,
  startDate: true,
  endDate: true,
} satisfies Prisma.ExperienceSelect;

const achievementSelect = {
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

  findByProfileId(profileId: number): Promise<ExperienceRecord[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
      select: experienceSelect,
    });
  }

  findAchievementsByExperienceId(
    experienceId: number,
  ): Promise<AchievementRecord[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId },
      orderBy: { sortOrder: 'asc' },
      select: achievementSelect,
    });
  }
}
