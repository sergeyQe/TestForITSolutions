import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '../profile/models/profile.model.js';
import { Project, toProjectModel } from './models/project.model.js';
import { ProjectsService } from './projects.service.js';

/** Поле Profile.projects объявляет модуль проектов, а не модуль профиля */
@Resolver(() => Profile)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @ResolveField(() => [Project], { description: 'Проекты в порядке показа' })
  async projects(@Parent() profile: Profile): Promise<Project[]> {
    const projects = await this.projectsService.getByProfile(profile.id);
    return projects.map(toProjectModel);
  }
}
