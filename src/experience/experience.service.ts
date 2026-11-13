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

/**
 * «ММ.ГГГГ». Только в UTC: дата хранится без времени, в местном поясе она сдвинулась бы на предыдущий месяц.
 * @param date - дата из базы: полночь первого числа месяца по UTC
 * @returns месяц и год строкой, например «02.2026»
 */
function formatMonth(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${month}.${date.getUTCFullYear()}`;
}

/**
 * «02.2026 – 10.2026»; без даты окончания — «02.2026 – по настоящее время».
 * @param startDate - начало работы
 * @param endDate - окончание работы; null — работает по настоящее время
 * @returns строка периода для поля Experience.period
 */
function formatPeriod(startDate: Date, endDate: Date | null): string {
  const end = endDate === null ? CURRENT_JOB_LABEL : formatMonth(endDate);
  return `${formatMonth(startDate)} – ${end}`;
}

/** Правила предметной области опыта: строка периода работы и «по настоящее время» */
@Injectable()
export class ExperienceService {
  constructor(
    private readonly experienceRepository: ExperienceRepository, // запросы к таблицам мест работы и достижений
  ) {}

  /**
   * Пакетный метод для загрузчика мест работы: к строкам из базы добавляет период.
   * @param profileIds - id профилей, чьи места работы нужны
   * @returns места работы всех этих профилей одним списком в порядке показа, со строкой period
   */
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

  /**
   * Пакетный метод для загрузчика достижений.
   * @param experienceIds - id мест работы, чьи достижения нужны
   * @returns достижения всех этих мест работы одним списком в порядке показа
   */
  getAchievements(
    experienceIds: readonly number[],
  ): Promise<AchievementData[]> {
    return this.experienceRepository.findAchievementsByExperienceIds(
      experienceIds,
    );
  }
}
