import { Injectable } from '@nestjs/common';
import { SkillsRepository, type SkillRecord } from './skills.repository.js';

/** Навыки отдаются как есть: правил преобразования для них нет */
export type SkillData = SkillRecord;

/** Навыки: своих правил нет, сервис сохраняет общий для модулей порядок слоёв */
@Injectable()
export class SkillsService {
  constructor(
    private readonly skillsRepository: SkillsRepository, // запросы к таблице навыков
  ) {}

  /**
   * Пакетный метод для загрузчика навыков.
   * @param profileIds - id профилей, чьи навыки нужны
   * @returns навыки всех этих профилей одним списком в порядке показа
   */
  getByProfiles(profileIds: readonly number[]): Promise<SkillData[]> {
    return this.skillsRepository.findByProfileIds(profileIds);
  }
}
