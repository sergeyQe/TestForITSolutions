import type { SeedData } from '../prisma/seed-database.js';

/**
 * Набор данных для тестов — того же типа, что данные визитки, и заливается той же функцией.
 * В нём есть оба особых случая: место работы без даты окончания и место работы без достижений.
 * Периоды начинаются и заканчиваются в январе и декабре: сдвиг даты на соседний месяц сразу виден.
 */
export const testData: SeedData = {
  profile: {
    name: 'Тестов Тест Тестович',
    description: 'Профиль для автоматических тестов',
  },

  links: [
    { type: 'GITHUB', label: 'GitHub', url: 'https://github.com/example' },
    { type: 'EMAIL', label: 'Почта', url: 'mailto:test@example.com' },
  ],

  skills: [
    { category: 'LANGUAGES', names: ['TypeScript', 'SQL'] },
    { category: 'BACKEND', names: ['Node.js'] },
  ],

  experiences: [
    {
      company: 'Текущая компания',
      position: 'Ведущий разработчик',
      startMonth: '2025-12',
      endMonth: null,
      achievements: ['Первое достижение', 'Второе достижение'],
    },
    {
      company: 'Компания без достижений',
      position: 'Разработчик',
      startMonth: '2024-01',
      endMonth: '2025-12',
      achievements: [],
    },
    {
      company: 'Первая компания',
      position: 'Младший разработчик',
      startMonth: '2023-02',
      endMonth: '2024-01',
      achievements: ['Единственное достижение'],
    },
  ],

  projects: [
    {
      name: 'Открытый проект',
      description: 'Проект со ссылкой',
      url: 'https://example.com/project',
    },
    {
      name: 'Внутренний проект',
      description: 'Проект без ссылки',
      url: null,
    },
  ],
};

/** Число строк в таблицах после заливки тестового набора */
export const expectedRowCounts = {
  profiles: 1,
  links: 2,
  skills: 3,
  experiences: 3,
  achievements: 3,
  projects: 2,
};

/**
 * Ответ на полный запрос для тестового набора. Записан явно, а не выведен из набора:
 * тест сверяет результат с тем, что должен увидеть клиент, а не повторяет код приложения.
 */
export const expectedProfile = {
  name: 'Тестов Тест Тестович',
  description: 'Профиль для автоматических тестов',
  links: [
    { type: 'GITHUB', label: 'GitHub', url: 'https://github.com/example' },
    { type: 'EMAIL', label: 'Почта', url: 'mailto:test@example.com' },
  ],
  skills: [
    { name: 'TypeScript', category: 'LANGUAGES' },
    { name: 'SQL', category: 'LANGUAGES' },
    { name: 'Node.js', category: 'BACKEND' },
  ],
  experience: [
    {
      company: 'Текущая компания',
      position: 'Ведущий разработчик',
      period: '12.2025 – по настоящее время',
      startDate: '2025-12-01',
      endDate: null,
      achievements: [
        { text: 'Первое достижение' },
        { text: 'Второе достижение' },
      ],
    },
    {
      company: 'Компания без достижений',
      position: 'Разработчик',
      period: '01.2024 – 12.2025',
      startDate: '2024-01-01',
      endDate: '2025-12-01',
      achievements: [],
    },
    {
      company: 'Первая компания',
      position: 'Младший разработчик',
      period: '02.2023 – 01.2024',
      startDate: '2023-02-01',
      endDate: '2024-01-01',
      achievements: [{ text: 'Единственное достижение' }],
    },
  ],
  projects: [
    {
      name: 'Открытый проект',
      description: 'Проект со ссылкой',
      url: 'https://example.com/project',
    },
    { name: 'Внутренний проект', description: 'Проект без ссылки', url: null },
  ],
};
