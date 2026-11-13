import { Field, ObjectType } from '@nestjs/graphql';
import type { ProjectData } from '../projects.service.js';

@ObjectType({ description: 'Проект, в котором участвовал специалист' })
export class Project {
  @Field({ description: 'Название проекта' })
  name: string; // название проекта

  @Field({ description: 'Что это за проект' })
  description: string; // краткое описание проекта

  @Field(() => String, {
    nullable: true,
    description:
      'Ссылка на сайт или репозиторий; null — у внутренних систем публичной ссылки нет',
  })
  url: string | null; // адрес сайта или репозитория; null — публичной ссылки нет
}

/**
 * Преобразует проект из сервиса в модель GraphQL; служебный profileId наружу не уходит.
 * @param project - проект из сервиса
 * @returns модель для ответа
 */
export function toProjectModel(project: ProjectData): Project {
  return {
    name: project.name,
    description: project.description,
    url: project.url,
  };
}
