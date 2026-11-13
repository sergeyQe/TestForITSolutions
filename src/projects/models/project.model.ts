import { Field, ObjectType } from '@nestjs/graphql';
import type { ProjectData } from '../projects.service.js';

@ObjectType({ description: 'Проект, в котором участвовал специалист' })
export class Project {
  @Field({ description: 'Название проекта' })
  name: string;

  @Field({ description: 'Что это за проект' })
  description: string;

  @Field(() => String, {
    nullable: true,
    description:
      'Ссылка на сайт или репозиторий; null — у внутренних систем публичной ссылки нет',
  })
  url: string | null;
}

export function toProjectModel(project: ProjectData): Project {
  return {
    name: project.name,
    description: project.description,
    url: project.url,
  };
}
