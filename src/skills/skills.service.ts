import { Injectable } from '@nestjs/common';
import { SkillsRepository, type SkillRecord } from './skills.repository.js';

/** Навыки отдаются как есть: правил преобразования для них нет */
export type SkillData = SkillRecord;

@Injectable()
export class SkillsService {
  constructor(private readonly skillsRepository: SkillsRepository) {}

  getByProfile(profileId: number): Promise<SkillData[]> {
    return this.skillsRepository.findByProfileId(profileId);
  }
}
