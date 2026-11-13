import { Injectable } from '@nestjs/common';
import { groupByKey } from '../common/group-by-key.js';
import { RequestLoaders } from '../common/request-loaders.js';
import {
  ExperienceService,
  type AchievementData,
  type ExperienceData,
} from './experience.service.js';

/** Загрузчики мест работы и достижений: обращения за один шаг выполнения запроса уходят одной выборкой */
@Injectable()
export class ExperienceLoader {
  private readonly byProfile: RequestLoaders<number, ExperienceData[]>;
  private readonly achievementsByExperience: RequestLoaders<
    number,
    AchievementData[]
  >;

  constructor(experienceService: ExperienceService) {
    // Места работы всех запрошенных профилей — одной выборкой
    this.byProfile = new RequestLoaders(async (profileIds) => {
      const experiences = await experienceService.getByProfiles(profileIds);
      return groupByKey(
        profileIds,
        experiences,
        (experience) => experience.profileId,
      );
    });

    // Достижения запрашиваются у каждого места работы отдельно — загрузчик сводит их в один запрос
    this.achievementsByExperience = new RequestLoaders(
      async (experienceIds) => {
        const achievements =
          await experienceService.getAchievements(experienceIds);
        return groupByKey(
          experienceIds,
          achievements,
          (achievement) => achievement.experienceId,
        );
      },
    );
  }

  loadByProfile(context: object, profileId: number): Promise<ExperienceData[]> {
    return this.byProfile.forRequest(context).load(profileId);
  }

  loadAchievements(
    context: object,
    experienceId: number,
  ): Promise<AchievementData[]> {
    return this.achievementsByExperience.forRequest(context).load(experienceId);
  }
}
