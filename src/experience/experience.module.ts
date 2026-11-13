import { Module } from '@nestjs/common';
import { ExperienceLoader } from './experience.loader.js';
import { ExperienceRepository } from './experience.repository.js';
import {
  ExperienceResolver,
  ProfileExperienceResolver,
} from './experience.resolver.js';
import { ExperienceService } from './experience.service.js';

/** Места работы и достижения; модуль сам объявляет поле Profile.experience */
@Module({
  providers: [
    ProfileExperienceResolver,
    ExperienceResolver,
    ExperienceLoader,
    ExperienceService,
    ExperienceRepository,
  ],
})
export class ExperienceModule {}
