import { Injectable } from '@nestjs/common';
import { groupByKey } from '../common/group-by-key.js';
import { RequestLoaders } from '../common/request-loaders.js';
import { SkillsService, type SkillData } from './skills.service.js';

/** Загрузчик навыков: собирает обращения за один шаг выполнения запроса в одну выборку */
@Injectable()
export class SkillsLoader {
  private readonly byProfile: RequestLoaders<number, SkillData[]>;

  constructor(skillsService: SkillsService) {
    this.byProfile = new RequestLoaders(async (profileIds) => {
      const skills = await skillsService.getByProfiles(profileIds);
      return groupByKey(profileIds, skills, (skill) => skill.profileId);
    });
  }

  loadByProfile(context: object, profileId: number): Promise<SkillData[]> {
    return this.byProfile.forRequest(context).load(profileId);
  }
}
