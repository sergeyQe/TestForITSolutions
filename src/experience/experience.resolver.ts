import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '../profile/models/profile.model.js';
import { ExperienceLoader } from './experience.loader.js';
import { Achievement, toAchievementModel } from './models/achievement.model.js';
import { Experience, toExperienceModel } from './models/experience.model.js';

/** Поле Profile.experience объявляет модуль опыта, а не модуль профиля */
@Resolver(() => Profile)
export class ProfileExperienceResolver {
  constructor(private readonly experienceLoader: ExperienceLoader) {}

  @ResolveField(() => [Experience], {
    description: 'Опыт работы: от последнего места к первому',
  })
  async experience(
    @Parent() profile: Profile,
    @Context() context: object,
  ): Promise<Experience[]> {
    const experiences = await this.experienceLoader.loadByProfile(
      context,
      profile.id,
    );
    return experiences.map(toExperienceModel);
  }
}

/** Вложенные поля самого места работы */
@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceLoader: ExperienceLoader) {}

  @ResolveField(() => [Achievement], {
    description: 'Достижения на этом месте работы в порядке показа',
  })
  async achievements(
    @Parent() experience: Experience,
    @Context() context: object,
  ): Promise<Achievement[]> {
    const achievements = await this.experienceLoader.loadAchievements(
      context,
      experience.id,
    );
    return achievements.map(toAchievementModel);
  }
}
