import { Module } from '@nestjs/common';
import { SkillsRepository } from './skills.repository.js';
import { SkillsResolver } from './skills.resolver.js';
import { SkillsService } from './skills.service.js';

/** Навыки; модуль сам объявляет поле Profile.skills */
@Module({
  providers: [SkillsResolver, SkillsService, SkillsRepository],
})
export class SkillsModule {}
