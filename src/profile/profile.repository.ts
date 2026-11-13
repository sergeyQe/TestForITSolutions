import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const profileSelect = {
  id: true,
  name: true,
  description: true,
} satisfies Prisma.ProfileSelect;

const linkSelect = {
  profileId: true,
  type: true,
  label: true,
  url: true,
} satisfies Prisma.LinkSelect;

export type ProfileRecord = Prisma.ProfileGetPayload<{
  select: typeof profileSelect;
}>;
export type LinkRecord = Prisma.LinkGetPayload<{ select: typeof linkSelect }>;

/** Запросы к таблицам профиля и ссылок */
@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Профиль в базе один; на случай лишних строк берётся первый по id */
  findFirst(): Promise<ProfileRecord | null> {
    return this.prisma.profile.findFirst({
      orderBy: { id: 'asc' },
      select: profileSelect,
    });
  }

  /** Пакетная выборка: один запрос на любое число профилей */
  findLinksByProfileIds(profileIds: readonly number[]): Promise<LinkRecord[]> {
    return this.prisma.link.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
      select: linkSelect,
    });
  }
}
