import { Field, ObjectType } from '@nestjs/graphql';
import type { AchievementData } from '../experience.service.js';

@ObjectType({ description: 'Достижение на месте работы' })
export class Achievement {
  @Field({ description: 'Что сделано и какой получен результат' })
  text: string;
}

export function toAchievementModel(achievement: AchievementData): Achievement {
  return { text: achievement.text };
}
