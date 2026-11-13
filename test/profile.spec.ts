import { seedDatabase } from '../prisma/seed-database.js';
import { FULL_PROFILE_QUERY } from '../src/config/full-profile-query.js';
import type { PrismaClient } from '../src/generated/prisma/client.js';
import { expectedProfile, expectedRowCounts, testData } from './test-data.js';
import {
  startTestEnvironment,
  type TestEnvironment,
} from './test-environment.js';

/** Дословный запрос из задания: без ссылок и достижений */
const ASSIGNMENT_QUERY = `query {
profile {
name
description
skills {
name
}
experience {
company
position
}
projects {
name
}
}
}`;

/** Все списки визитки — по одному полю, чтобы проверить только порядок */
const LISTS_QUERY = `{
  profile {
    links { label }
    skills { name }
    experience { company achievements { text } }
    projects { name }
  }
}`;

const EXTRA_EXPERIENCES = 20;

/** Меняет порядок показа всех списков на обратный, не трогая порядок строк в таблицах */
async function reverseSortOrder(prisma: PrismaClient): Promise<void> {
  const reversed = { data: { sortOrder: { multiply: -1 } } };
  await prisma.$transaction([
    prisma.link.updateMany(reversed),
    prisma.skill.updateMany(reversed),
    prisma.experience.updateMany(reversed),
    prisma.achievement.updateMany(reversed),
    prisma.project.updateMany(reversed),
  ]);
}

/** Добавляет профилю места работы — у каждого по два достижения */
async function addExperiences(
  prisma: PrismaClient,
  count: number,
): Promise<void> {
  const profile = await prisma.profile.findFirstOrThrow();
  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      experiences: {
        create: Array.from({ length: count }, (_, index) => ({
          company: `Дополнительная компания ${index + 1}`,
          position: 'Разработчик',
          startDate: new Date('2020-01-01T00:00:00.000Z'),
          endDate: new Date('2021-01-01T00:00:00.000Z'),
          sortOrder: 100 + index,
          achievements: {
            create: [
              { text: 'Первое достижение', sortOrder: 0 },
              { text: 'Второе достижение', sortOrder: 1 },
            ],
          },
        })),
      },
    },
  });
}

async function countRows(
  prisma: PrismaClient,
): Promise<typeof expectedRowCounts> {
  const [profiles, links, skills, experiences, achievements, projects] =
    await Promise.all([
      prisma.profile.count(),
      prisma.link.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.achievement.count(),
      prisma.project.count(),
    ]);
  return { profiles, links, skills, experiences, achievements, projects };
}

describe('Запрос profile', () => {
  let environment: TestEnvironment;

  beforeAll(async () => {
    environment = await startTestEnvironment();
  });

  afterAll(async () => {
    await environment.stop();
  });

  // Каждый тест начинает с одного и того же содержимого базы — порядок запуска тестов не важен
  beforeEach(async () => {
    await seedDatabase(environment.prisma, testData);
  });

  it('полный запрос возвращает все вложенные данные в порядке показа', async () => {
    // Вся визитка: пустой список у места работы без достижений, «по настоящее время» без даты окончания
    const full = await environment.execute(FULL_PROFILE_QUERY);
    expect(full.body).toEqual({ data: { profile: expectedProfile } });

    // Порядок задаёт sort_order, а не порядок вставки: номера перевёрнуты — списки приходят в обратном порядке
    await reverseSortOrder(environment.prisma);
    const reversed = await environment.execute(LISTS_QUERY);
    expect(reversed.body).toEqual({
      data: {
        profile: {
          links: [{ label: 'Почта' }, { label: 'GitHub' }],
          skills: [
            { name: 'Node.js' },
            { name: 'SQL' },
            { name: 'TypeScript' },
          ],
          experience: [
            {
              company: 'Первая компания',
              achievements: [{ text: 'Единственное достижение' }],
            },
            { company: 'Компания без достижений', achievements: [] },
            {
              company: 'Текущая компания',
              achievements: [
                { text: 'Второе достижение' },
                { text: 'Первое достижение' },
              ],
            },
          ],
          projects: [
            { name: 'Внутренний проект' },
            { name: 'Открытый проект' },
          ],
        },
      },
    });
  });

  it('полный запрос — 6 запросов к базе при любом числе мест работы, запрос из задания — 4', async () => {
    // По одному запросу на таблицу: профиль, ссылки, навыки, места работы, достижения, проекты
    const full = await environment.execute(FULL_PROFILE_QUERY);
    expect(full.databaseQueries).toBe(6);

    // Мест работы стало в несколько раз больше, у каждого свои достижения — запросов столько же (нет N+1)
    await addExperiences(environment.prisma, EXTRA_EXPERIENCES);
    const grown = await environment.execute(FULL_PROFILE_QUERY);
    const lastIndex = testData.experiences.length + EXTRA_EXPERIENCES - 1;
    expect(grown.body).toHaveProperty(
      `data.profile.experience.${lastIndex}.achievements.1.text`,
      'Второе достижение',
    );
    expect(grown.databaseQueries).toBe(6);

    // Без ссылок и достижений их таблицы не читаются: запрошено меньше полей — меньше запросов
    const assignment = await environment.execute(ASSIGNMENT_QUERY);
    expect(assignment.databaseQueries).toBe(4);
  });

  it('profile { name } — 1 запрос к базе', async () => {
    const result = await environment.execute('{ profile { name } }');

    expect(result.body).toEqual({
      data: { profile: { name: testData.profile.name } },
    });
    expect(result.databaseQueries).toBe(1);
  });

  it('повторный seed не создаёт дубликатов', async () => {
    // Первый seed уже выполнен перед тестом
    expect(await countRows(environment.prisma)).toEqual(expectedRowCounts);

    // Второй запуск на тех же данных приводит базу к тому же содержимому
    await seedDatabase(environment.prisma, testData);
    expect(await countRows(environment.prisma)).toEqual(expectedRowCounts);

    const repeated = await environment.execute(FULL_PROFILE_QUERY);
    expect(repeated.body).toEqual({ data: { profile: expectedProfile } });
  });
});
