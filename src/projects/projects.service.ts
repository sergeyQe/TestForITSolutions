import { Injectable } from '@nestjs/common';
import {
  ProjectsRepository,
  type ProjectRecord,
} from './projects.repository.js';

/** Проекты отдаются как есть: правил преобразования для них нет */
export type ProjectData = ProjectRecord;

/** Проекты: своих правил нет, сервис сохраняет общий для модулей порядок слоёв */
@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository, // запросы к таблице проектов
  ) {}

  /**
   * Пакетный метод для загрузчика проектов.
   * @param profileIds - id профилей, чьи проекты нужны
   * @returns проекты всех этих профилей одним списком в порядке показа
   */
  getByProfiles(profileIds: readonly number[]): Promise<ProjectData[]> {
    return this.projectsRepository.findByProfileIds(profileIds);
  }
}
