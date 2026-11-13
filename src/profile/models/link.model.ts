import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkType } from '../../generated/prisma/enums.js';
import type { LinkData } from '../profile.service.js';

// Перечисление объявлено один раз — в схеме базы; здесь оно только регистрируется в схеме GraphQL
registerEnumType(LinkType, {
  name: 'LinkType',
  description: 'Вид ссылки',
  valuesMap: {
    GITHUB: { description: 'Профиль на GitHub' },
    TELEGRAM: { description: 'Контакт в Telegram' },
    EMAIL: { description: 'Электронная почта' },
    HH: { description: 'Резюме на hh.ru' },
    LINKEDIN: { description: 'Профиль в LinkedIn' },
  },
});

@ObjectType({ description: 'Ссылка на профессиональный ресурс или контакт' })
export class Link {
  @Field(() => LinkType, { description: 'Вид ссылки' })
  type: LinkType;

  @Field({ description: 'Подпись для показа' })
  label: string;

  @Field({ description: 'Адрес: https://…, для почты — mailto:…' })
  url: string;
}

export function toLinkModel(link: LinkData): Link {
  return { type: link.type, label: link.label, url: link.url };
}
