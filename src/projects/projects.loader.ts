import { Injectable } from '@nestjs/common';
import { groupByKey } from '../common/group-by-key.js';
import { RequestLoaders } from '../common/request-loaders.js';
import { ProjectsService, type ProjectData } from './projects.service.js';

/** Загрузчик проектов: собирает обращения за один шаг выполнения запроса в одну выборку */
@Injectable()
export class ProjectsLoader {
  private readonly byProfile: RequestLoaders<number, ProjectData[]>; // проекты по id профиля

  /**
   * @param projectsService - сервис проектов: загрузчик вызывает его пакетный метод
   */
  constructor(projectsService: ProjectsService) {
    // Проекты всех запрошенных профилей — одной выборкой
    this.byProfile = new RequestLoaders(async (profileIds) => {
      const projects = await projectsService.getByProfiles(profileIds);
      return groupByKey(profileIds, projects, (project) => project.profileId);
    });
  }

  /**
   * Проекты профиля; обращения за один шаг выполнения запроса уходят одной выборкой.
   * @param context - контекст запроса GraphQL: по нему выбирается загрузчик этого запроса
   * @param profileId - id профиля-родителя
   * @returns проекты профиля в порядке показа; пустой список, если проектов нет
   */
  loadByProfile(context: object, profileId: number): Promise<ProjectData[]> {
    return this.byProfile.forRequest(context).load(profileId);
  }
}
