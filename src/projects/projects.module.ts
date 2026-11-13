import { Module } from '@nestjs/common';
import { ProjectsLoader } from './projects.loader.js';
import { ProjectsRepository } from './projects.repository.js';
import { ProjectsResolver } from './projects.resolver.js';
import { ProjectsService } from './projects.service.js';

/** Проекты; модуль сам объявляет поле Profile.projects */
@Module({
  providers: [
    ProjectsResolver,
    ProjectsLoader,
    ProjectsService,
    ProjectsRepository,
  ],
})
export class ProjectsModule {}
