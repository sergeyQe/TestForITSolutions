import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const projectSelect = {
  name: true,
  description: true,
  url: true,
} satisfies Prisma.ProjectSelect;

export type ProjectRecord = Prisma.ProjectGetPayload<{
  select: typeof projectSelect;
}>;

/** Запросы к таблице проектов */
@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileId(profileId: number): Promise<ProjectRecord[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
      select: projectSelect,
    });
  }
}
