import { Module } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository.js';
import { ProjectsResolver } from './projects.resolver.js';
import { ProjectsService } from './projects.service.js';

/** Проекты; модуль сам объявляет поле Profile.projects */
@Module({
  providers: [ProjectsResolver, ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
