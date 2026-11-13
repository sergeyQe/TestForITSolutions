import { Field, ObjectType } from '@nestjs/graphql';
import type { ProfileData } from '../profile.service.js';

@ObjectType({ description: 'Профиль специалиста' })
export class Profile {
  /** Нужен резолверам вложенных полей, в схему GraphQL не входит */
  id: number;

  @Field({ description: 'Фамилия, имя и отчество' })
  name: string; // ФИО одной строкой

  @Field({
    description: 'Краткое описание: опыт, специализация, основной стек',
  })
  description: string; // текст «о себе»
}

/**
 * Преобразует профиль из сервиса в модель GraphQL.
 * @param profile - профиль из сервиса
 * @returns модель для ответа; id сохраняется — по нему резолверы вложенных полей находят детей
 */
export function toProfileModel(profile: ProfileData): Profile {
  return {
    id: profile.id,
    name: profile.name,
    description: profile.description,
  };
}
