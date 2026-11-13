import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Колонки профиля, которые читает приложение */
const profileSelect = {
  id: true,
  name: true,
  description: true,
} satisfies Prisma.ProfileSelect;

/** Колонки ссылки, которые читает приложение; profileId нужен загрузчику для раскладки по профилям */
const linkSelect = {
  profileId: true,
  type: true,
  label: true,
  url: true,
} satisfies Prisma.LinkSelect;

/** Строка профиля из базы: тип выведен из profileSelect */
export type ProfileRecord = Prisma.ProfileGetPayload<{
  select: typeof profileSelect;
}>;
/** Строка ссылки из базы: тип выведен из linkSelect */
export type LinkRecord = Prisma.LinkGetPayload<{ select: typeof linkSelect }>;

/** Запросы к таблицам профиля и ссылок */
@Injectable()
export class ProfileRepository {
  constructor(
    private readonly prisma: PrismaService, // клиент базы данных
  ) {}

  /**
   * Профиль в базе один; на случай лишних строк берётся первый по id. Параметров нет.
   * @returns профиль (id, name, description) или null, если таблица пуста
   */
  findFirst(): Promise<ProfileRecord | null> {
    return this.prisma.profile.findFirst({
      orderBy: { id: 'asc' },
      select: profileSelect,
    });
  }

  /**
   * Пакетная выборка: один запрос на любое число профилей.
   * @param profileIds - id профилей, чьи ссылки нужны
   * @returns ссылки всех этих профилей одним списком по возрастанию sortOrder;
   *   в каждой строке есть profileId — по нему загрузчик раскладывает строки по родителям
   */
  findLinksByProfileIds(profileIds: readonly number[]): Promise<LinkRecord[]> {
    return this.prisma.link.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
      select: linkSelect,
    });
  }
}
