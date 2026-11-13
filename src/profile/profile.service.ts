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

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(): Promise<ProfileData> {
    const profile = await this.profileRepository.findFirst();

    // Пустая база — не сбой сервера, а отдельная ошибка предметной области
    if (!profile) {
      throw new ProfileNotFoundError();
    }
    return profile;
  }

  getLinks(profileIds: readonly number[]): Promise<LinkData[]> {
    return this.profileRepository.findLinksByProfileIds(profileIds);
  }
}
