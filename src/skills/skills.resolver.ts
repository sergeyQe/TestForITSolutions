import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '../profile/models/profile.model.js';
import { Skill, toSkillModel } from './models/skill.model.js';
import { SkillsLoader } from './skills.loader.js';

/** Поле Profile.skills объявляет модуль навыков, а не модуль профиля */
@Resolver(() => Profile)
export class SkillsResolver {
  constructor(
    private readonly skillsLoader: SkillsLoader, // загрузчик навыков
  ) {}

  /**
   * Поле Profile.skills.
   * @param profile - профиль-родитель; нужен только его id
   * @param context - контекст запроса GraphQL, передаётся в загрузчик
   * @returns навыки в порядке показа
   */
  @ResolveField(() => [Skill], {
    description:
      'Навыки одним списком в порядке показа: навыки одной категории идут подряд',
  })
  async skills(
    @Parent() profile: Profile,
    @Context() context: object,
  ): Promise<Skill[]> {
    const skills = await this.skillsLoader.loadByProfile(context, profile.id);
    return skills.map(toSkillModel);
  }
}
