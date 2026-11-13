import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '../profile/models/profile.model.js';
import { Skill, toSkillModel } from './models/skill.model.js';
import { SkillsService } from './skills.service.js';

/** Поле Profile.skills объявляет модуль навыков, а не модуль профиля */
@Resolver(() => Profile)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @ResolveField(() => [Skill], {
    description:
      'Навыки одним списком в порядке показа: навыки одной категории идут подряд',
  })
  async skills(@Parent() profile: Profile): Promise<Skill[]> {
    const skills = await this.skillsService.getByProfile(profile.id);
    return skills.map(toSkillModel);
  }
}
