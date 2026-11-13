import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const skillSelect = {
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

  findByProfileId(profileId: number): Promise<SkillRecord[]> {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
      select: skillSelect,
    });
  }
}
