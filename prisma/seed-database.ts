import type { PrismaClient } from '../src/generated/prisma/client.js';
import type { LinkType, SkillCategory } from '../src/generated/prisma/enums.js';

/** Месяц в виде «ГГГГ-ММ»: точность периода работы — месяц */
export type YearMonth = `${number}-${number}`;

/**
 * Содержимое визитки. Порядок вывода задаётся порядком элементов в списках:
 * номера для сортировки проставляет функция заливки.
 */
export type SeedData = {
  profile: { name: string; description: string }; // ФИО и текст «о себе»
  links: { type: LinkType; label: string; url: string }[]; // ссылки в порядке показа
  skills: { category: SkillCategory; names: string[] }[]; // навыки по категориям в порядке показа
  experiences: {
    company: string; // компания
    position: string; // должность
    startMonth: YearMonth; // месяц начала работы
    endMonth: YearMonth | null; // месяц окончания; null — работает по настоящее время
    achievements: string[]; // достижения в порядке показа
  }[]; // места работы в порядке показа: от последнего к первому
  projects: { name: string; description: string; url: string | null }[]; // проекты в порядке показа
};

/**
 * Первое число месяца в UTC: дата хранится без времени, день значения не несёт.
 * @param month - месяц «ГГГГ-ММ» из набора данных
 * @returns дата: полночь первого числа этого месяца по UTC
 * @throws Error, если строка не является месяцем (например, «2026-13»)
 */
function firstDayOfMonth(month: YearMonth): Date {
  const date = new Date(`${month}-01T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Неверный месяц в данных визитки: «${month}»`);
  }
  return date;
}

/**
 * Номер для сортировки — место элемента в списке.
 * @param items - элементы в порядке показа
 * @returns те же элементы с добавленным полем sortOrder (0, 1, 2, …)
 */
function withSortOrder<T>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: index }));
}

/**
 * Приводит базу к содержимому набора данных: в одной транзакции удаляет прежнюю визитку
 * и вставляет новую. Повторный запуск не создаёт дубликатов и не оставляет старых строк.
 * @param prisma - клиент Prisma: в seed.ts — временный, в тестах — клиент тестового окружения
 * @param data - содержимое визитки: seed-data.ts или тестовый набор test/test-data.ts
 * @returns обещание без значения; при ошибке транзакция откатывается и база остаётся прежней
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
