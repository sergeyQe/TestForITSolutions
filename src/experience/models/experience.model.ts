import { Field, ObjectType } from '@nestjs/graphql';
import { DateScalar } from '../../common/date.scalar.js';
import type { ExperienceData } from '../experience.service.js';

@ObjectType({ description: 'Место работы' })
export class Experience {
  /** Нужен резолверу достижений, в схему GraphQL не входит */
  id: number;

  @Field({ description: 'Компания' })
  company: string;

  @Field({ description: 'Должность' })
  position: string;

  @Field(() => DateScalar, {
    description: 'Начало работы. Точность — месяц, день всегда 01',
  })
  startDate: Date;

  @Field(() => DateScalar, {
    nullable: true,
    description:
      'Окончание работы. Точность — месяц, день всегда 01; null — работает по настоящее время',
  })
  endDate: Date | null;

  @Field({
    description:
      'Период работы строкой: «02.2026 – 10.2026» или «02.2026 – по настоящее время»',
  })
  period: string;
}

export function toExperienceModel(experience: ExperienceData): Experience {
  return {
    id: experience.id,
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate,
    period: experience.period,
  };
}
