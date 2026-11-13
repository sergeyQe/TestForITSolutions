import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '../profile/models/profile.model.js';
import { Project, toProjectModel } from './models/project.model.js';
import { ProjectsLoader } from './projects.loader.js';

/** Поле Profile.projects объявляет модуль проектов, а не модуль профиля */
@Resolver(() => Profile)
export class ProjectsResolver {
  constructor(
    private readonly projectsLoader: ProjectsLoader, // загрузчик проектов
  ) {}

  /**
   * Поле Profile.projects.
   * @param profile - профиль-родитель; нужен только его id
   * @param context - контекст запроса GraphQL, передаётся в загрузчик
   * @returns проекты в порядке показа
   */
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
