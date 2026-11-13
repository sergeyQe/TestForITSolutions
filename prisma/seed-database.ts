import type { PrismaClient } from '../src/generated/prisma/client.js';
import type { LinkType, SkillCategory } from '../src/generated/prisma/enums.js';

/** Месяц в виде «ГГГГ-ММ»: точность периода работы — месяц */
export type YearMonth = `${number}-${number}`;

/**
 * Содержимое визитки. Порядок вывода задаётся порядком элементов в списках:
 * номера для сортировки проставляет функция заливки.
 */
export type SeedData = {
  profile: { name: string; description: string };
  links: { type: LinkType; label: string; url: string }[];
  skills: { category: SkillCategory; names: string[] }[];
  experiences: {
    company: string;
    position: string;
    startMonth: YearMonth;
    /** null — работает по настоящее время */
    endMonth: YearMonth | null;
    achievements: string[];
  }[];
  projects: { name: string; description: string; url: string | null }[];
};

/** Первое число месяца в UTC: дата хранится без времени, день значения не несёт */
function firstDayOfMonth(month: YearMonth): Date {
  const date = new Date(`${month}-01T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Неверный месяц в данных визитки: «${month}»`);
  }
  return date;
}

/** Номер для сортировки — место элемента в списке */
function withSortOrder<T>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: index }));
}

/**
 * Приводит базу к содержимому набора данных: в одной транзакции удаляет прежнюю визитку
 * и вставляет новую. Повторный запуск не создаёт дубликатов и не оставляет старых строк.
 */
export async function seedDatabase(
  prisma: PrismaClient,
  data: SeedData,
): Promise<void> {
  // Навыки хранятся плоским списком: порядок сквозной, по категориям в порядке их перечисления
  const skills = data.skills.flatMap(({ category, names }) =>
    names.map((name) => ({ category, name })),
  );

  await prisma.$transaction([
    // Удаление профиля каскадом очищает все дочерние таблицы
    prisma.profile.deleteMany(),
    // Профиль вставляется одним вложенным запросом вместе со всеми связанными строками
    prisma.profile.create({
      data: {
        ...data.profile,
        links: { create: withSortOrder(data.links) },
        skills: { create: withSortOrder(skills) },
        experiences: {
          create: withSortOrder(
            data.experiences.map((experience) => ({
              company: experience.company,
              position: experience.position,
              startDate: firstDayOfMonth(experience.startMonth),
              endDate:
                experience.endMonth === null
                  ? null
                  : firstDayOfMonth(experience.endMonth),
              achievements: {
                create: withSortOrder(
                  experience.achievements.map((text) => ({ text })),
                ),
              },
            })),
          ),
        },
        projects: { create: withSortOrder(data.projects) },
      },
    }),
  ]);
}
