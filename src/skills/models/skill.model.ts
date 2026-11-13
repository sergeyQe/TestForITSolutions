import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '../../generated/prisma/enums.js';
import type { SkillData } from '../skills.service.js';

// Перечисление объявлено один раз — в схеме базы; здесь оно только регистрируется в схеме GraphQL
registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Категория навыка',
  valuesMap: {
    LANGUAGES: { description: 'Языки программирования' },
    BACKEND: { description: 'Backend: платформы, фреймворки, протоколы' },
    DATA: { description: 'Базы данных и брокеры сообщений' },
    ARCHITECTURE: { description: 'Архитектурные подходы' },
    DEVOPS: { description: 'Инфраструктура и доставка' },
    TESTING: { description: 'Тестирование' },
  },
});

@ObjectType({ description: 'Навык: технология, инструмент или подход' })
export class Skill {
  @Field({ description: 'Название навыка' })
  name: string; // название технологии, инструмента или подхода

  @Field(() => SkillCategory, { description: 'Категория навыка' })
  category: SkillCategory; // группа навыка: перечисление из схемы базы
}

/**
 * Преобразует навык из сервиса в модель GraphQL; служебный profileId наружу не уходит.
 * @param skill - навык из сервиса
 * @returns модель для ответа
 */
export function toSkillModel(skill: SkillData): Skill {
  return { name: skill.name, category: skill.category };
}
