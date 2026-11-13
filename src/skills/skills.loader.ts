import { Injectable } from '@nestjs/common';
import { groupByKey } from '../common/group-by-key.js';
import { RequestLoaders } from '../common/request-loaders.js';
import { SkillsService, type SkillData } from './skills.service.js';

/** Загрузчик навыков: собирает обращения за один шаг выполнения запроса в одну выборку */
@Injectable()
export class SkillsLoader {
  private readonly byProfile: RequestLoaders<number, SkillData[]>; // навыки по id профиля

  /**
   * @param skillsService - сервис навыков: загрузчик вызывает его пакетный метод
   */
  constructor(skillsService: SkillsService) {
    // Навыки всех запрошенных профилей — одной выборкой
    this.byProfile = new RequestLoaders(async (profileIds) => {
      const skills = await skillsService.getByProfiles(profileIds);
      return groupByKey(profileIds, skills, (skill) => skill.profileId);
    });
  }

  /**
   * Навыки профиля; обращения за один шаг выполнения запроса уходят одной выборкой.
   * @param context - контекст запроса GraphQL: по нему выбирается загрузчик этого запроса
   * @param profileId - id профиля-родителя
   * @returns навыки профиля в порядке показа; пустой список, если навыков нет
   */
  loadByProfile(context: object, profileId: number): Promise<SkillData[]> {
    return this.byProfile.forRequest(context).load(profileId);
  }
}
