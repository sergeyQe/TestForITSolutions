import { Injectable } from '@nestjs/common';
import {
  ProjectsRepository,
  type ProjectRecord,
} from './projects.repository.js';

/** Проекты отдаются как есть: правил преобразования для них нет */
export type ProjectData = ProjectRecord;

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  getByProfiles(profileIds: readonly number[]): Promise<ProjectData[]> {
    return this.projectsRepository.findByProfileIds(profileIds);
  }
}
