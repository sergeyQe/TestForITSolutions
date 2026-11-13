import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '../profile/models/profile.model.js';
import { Project, toProjectModel } from './models/project.model.js';
import { ProjectsLoader } from './projects.loader.js';

/** Поле Profile.projects объявляет модуль проектов, а не модуль профиля */
@Resolver(() => Profile)
export class ProjectsResolver {
  constructor(private readonly projectsLoader: ProjectsLoader) {}

  @ResolveField(() => [Project], { description: 'Проекты в порядке показа' })
  async projects(
    @Parent() profile: Profile,
    @Context() context: object,
  ): Promise<Project[]> {
    const projects = await this.projectsLoader.loadByProfile(
      context,
      profile.id,
    );
    return projects.map(toProjectModel);
  }
}
