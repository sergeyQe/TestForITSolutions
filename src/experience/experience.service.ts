import { Injectable } from '@nestjs/common';
import {
  ExperienceRepository,
  type AchievementRecord,
  type ExperienceRecord,
} from './experience.repository.js';

/** Место работы с готовой строкой периода */
export type ExperienceData = ExperienceRecord & { period: string };

/** Достижения отдаются как есть: правил преобразования для них нет */
export type AchievementData = AchievementRecord;

const CURRENT_JOB_LABEL = 'по настоящее время';

/** «ММ.ГГГГ». Только в UTC: дата хранится без времени, в местном поясе она сдвинулась бы на предыдущий месяц */
function formatMonth(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${month}.${date.getUTCFullYear()}`;
}

/** «02.2026 – 10.2026»; без даты окончания — «02.2026 – по настоящее время» */
function formatPeriod(startDate: Date, endDate: Date | null): string {
  const end = endDate === null ? CURRENT_JOB_LABEL : formatMonth(endDate);
  return `${formatMonth(startDate)} – ${end}`;
}

@Injectable()
export class ExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async getByProfiles(
    profileIds: readonly number[],
  ): Promise<ExperienceData[]> {
    const experiences =
      await this.experienceRepository.findByProfileIds(profileIds);

    // Строка периода — правило предметной области, поэтому считается здесь, а не в резолвере
    return experiences.map((experience) => ({
      ...experience,
      period: formatPeriod(experience.startDate, experience.endDate),
    }));
  }

  getAchievements(
    experienceIds: readonly number[],
  ): Promise<AchievementData[]> {
    return this.experienceRepository.findAchievementsByExperienceIds(
      experienceIds,
    );
  }
}
