import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const skillSelect = {
  profileId: true,
  name: true,
  category: true,
} satisfies Prisma.SkillSelect;

export type SkillRecord = Prisma.SkillGetPayload<{
  select: typeof skillSelect;
}>;

/** Запросы к таблице навыков */
@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Пакетная выборка: один запрос на любое число профилей */
  findByProfileIds(profileIds: readonly number[]): Promise<SkillRecord[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
      select: skillSelect,
    });
  }
}
