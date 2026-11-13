import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '../profile/models/profile.model.js';
import { ExperienceService } from './experience.service.js';
import { Achievement, toAchievementModel } from './models/achievement.model.js';
import { Experience, toExperienceModel } from './models/experience.model.js';

/** Поле Profile.experience объявляет модуль опыта, а не модуль профиля */
@Resolver(() => Profile)
export class ProfileExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @ResolveField(() => [Experience], {
    description: 'Опыт работы: от последнего места к первому',
  })
  async experience(@Parent() profile: Profile): Promise<Experience[]> {
    const experiences = await this.experienceService.getByProfile(profile.id);
    return experiences.map(toExperienceModel);
  }
}

/** Вложенные поля самого места работы */
@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @ResolveField(() => [Achievement], {
    description: 'Достижения на этом месте работы в порядке показа',
  })
  async achievements(@Parent() experience: Experience): Promise<Achievement[]> {
    const achievements = await this.experienceService.getAchievements(
      experience.id,
    );
    return achievements.map(toAchievementModel);
  }
}
