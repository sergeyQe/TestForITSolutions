import { Injectable } from '@nestjs/common';
import {
  ProfileRepository,
  type LinkRecord,
  type ProfileRecord,
} from './profile.repository.js';

/** Профиль и ссылки отдаются как есть: правил преобразования для них нет */
export type ProfileData = ProfileRecord;
export type LinkData = LinkRecord;

/** Профиля в базе нет. Как показать это клиенту, решает резолвер: сервис о GraphQL не знает */
export class ProfileNotFoundError extends Error {
  constructor() {
    super('Профиль не найден: база данных не заполнена');
    this.name = 'ProfileNotFoundError';
  }
}

/** Правила предметной области профиля: пустая база — это «профиль не найден» */
@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository, // запросы к таблицам профиля и ссылок
  ) {}

  /**
   * Профиль визитки. Параметров нет: профиль в базе один.
   * @returns профиль
   * @throws ProfileNotFoundError, если база не заполнена
   */
  async getProfile(): Promise<ProfileData> {
    const profile = await this.profileRepository.findFirst();

    // Пустая база — не сбой сервера, а отдельная ошибка предметной области
    if (!profile) {
      throw new ProfileNotFoundError();
    }
    return profile;
  }

  /**
   * Пакетный метод для загрузчика ссылок.
   * @param profileIds - id профилей, чьи ссылки нужны
   * @returns ссылки всех этих профилей одним списком в порядке показа
   */
  getLinks(profileIds: readonly number[]): Promise<LinkData[]> {
    return this.profileRepository.findLinksByProfileIds(profileIds);
  }
}
