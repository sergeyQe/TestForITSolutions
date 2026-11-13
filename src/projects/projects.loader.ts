import { Injectable } from '@nestjs/common';
import { groupByKey } from '../common/group-by-key.js';
import { RequestLoaders } from '../common/request-loaders.js';
import { ProjectsService, type ProjectData } from './projects.service.js';

/** Загрузчик проектов: собирает обращения за один шаг выполнения запроса в одну выборку */
@Injectable()
export class ProjectsLoader {
  private readonly byProfile: RequestLoaders<number, ProjectData[]>;

  constructor(projectsService: ProjectsService) {
    this.byProfile = new RequestLoaders(async (profileIds) => {
      const projects = await projectsService.getByProfiles(profileIds);
      return groupByKey(profileIds, projects, (project) => project.profileId);
    });
  }

  loadByProfile(context: object, profileId: number): Promise<ProjectData[]> {
    return this.byProfile.forRequest(context).load(profileId);
  }
}
