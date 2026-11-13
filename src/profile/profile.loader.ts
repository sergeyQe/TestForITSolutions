import { Injectable } from '@nestjs/common';
import { groupByKey } from '../common/group-by-key.js';
import { RequestLoaders } from '../common/request-loaders.js';
import {
  ProfileService,
  type LinkData,
  type ProfileData,
} from './profile.service.js';

/** Профиль в базе один, поэтому у загрузчика профиля единственный ключ */
const SINGLE_PROFILE_KEY = 'profile';

/** Загрузчики профиля и ссылок */
@Injectable()
export class ProfileLoader {
  private readonly profile: RequestLoaders<
    typeof SINGLE_PROFILE_KEY,
    ProfileData
  >;
  private readonly linksByProfile: RequestLoaders<number, LinkData[]>;

  constructor(profileService: ProfileService) {
    // Корневое поле можно повторить в одном запросе под псевдонимами — профиль читается один раз
    this.profile = new RequestLoaders(async (keys) => {
      const profile = await profileService.getProfile();
      return keys.map(() => profile);
    });

    // Ссылки всех запрошенных профилей — одной выборкой
    this.linksByProfile = new RequestLoaders(async (profileIds) => {
      const links = await profileService.getLinks(profileIds);
      return groupByKey(profileIds, links, (link) => link.profileId);
    });
  }

  loadProfile(context: object): Promise<ProfileData> {
    return this.profile.forRequest(context).load(SINGLE_PROFILE_KEY);
  }

  loadLinks(context: object, profileId: number): Promise<LinkData[]> {
    return this.linksByProfile.forRequest(context).load(profileId);
  }
}
