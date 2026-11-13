import { Field, ObjectType } from '@nestjs/graphql';
import type { AchievementData } from '../experience.service.js';

@ObjectType({ description: 'Достижение на месте работы' })
export class Achievement {
  @Field({ description: 'Что сделано и какой получен результат' })
  text: string; // текст достижения
}

/**
 * Преобразует достижение из сервиса в модель GraphQL; служебный experienceId наружу не уходит.
 * @param achievement - достижение из сервиса
 * @returns модель для ответа
 */
export function toAchievementModel(achievement: AchievementData): Achievement {
  return { text: achievement.text };
}
