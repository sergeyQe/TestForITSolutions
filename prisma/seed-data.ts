import type { SeedData } from './seed-database.js';

/**
 * Данные визитки — единственный источник правды.
 * Чтобы изменить визитку, достаточно поправить этот файл и заново выполнить seed.
 */
export const seedData: SeedData = {
  profile: {
    name: 'Титов Сергей Александрович',
    description:
      'Backend-разработчик, 4+ года опыта. Последние полтора года в финтехе: BNPL, платёжные сервисы, ' +
      'выпуск виртуальных карт. Проектирую денежный контур так, чтобы деньги не терялись: саги, ' +
      'идемпотентность, inbox для колбэков, сверка с провайдерами. Отвечаю за сервис от архитектуры ' +
      'до прода. Основной стек — C# / .NET.',
  },

  links: [
    { type: 'GITHUB', label: 'GitHub', url: 'https://github.com/sergeyQe' },
    {
      type: 'TELEGRAM',
      label: 'Telegram',
      url: 'https://t.me/sergey_titov9999',
    },
    {
      type: 'EMAIL',
      label: 'Почта',
      url: 'mailto:sergey_aleksandrovichiiii@bk.ru',
    },
    {
      type: 'HH',
      label: 'hh.ru',
      url: 'https://hh.ru/resume/f95bb55fff115d691a0039ed1f4f7434645539',
    },
  ],

  skills: [
    { category: 'LANGUAGES', names: ['C#', 'TypeScript', 'SQL'] },
    {
      category: 'BACKEND',
      names: ['.NET / ASP.NET Core', 'EF Core', 'Node.js', 'GraphQL', 'gRPC'],
    },
    {
      category: 'DATA',
      names: [
        'PostgreSQL',
        'MS SQL',
        'Redis',
        'Kafka',
        'RabbitMQ',
        'Elasticsearch',
      ],
    },
    {
      category: 'ARCHITECTURE',
      names: [
        'Микросервисы',
        'Saga',
        'Outbox / Inbox',
        'CQRS',
        'идемпотентность',
      ],
    },
    { category: 'DEVOPS', names: ['Docker', 'Kubernetes', 'nginx', 'CI/CD'] },
    { category: 'TESTING', names: ['xUnit', 'Testcontainers'] },
  ],

  experiences: [
    {
      company: 'TSI Global Solutions LTD (Platina Wallet / PayWay)',
      position: 'Backend-разработчик .NET',
      startMonth: '2026-02',
      endMonth: '2026-10',
      achievements: [
        'Вывел в прод MVP сервиса оплаты игр через СБП за неделю: MVP подтвердил спрос, продукт перевели на платформу PayWay.',
        'Разработал сервис выпуска виртуальных валютных карт: пополнение через СБП, KYC, 3-D Secure, саги выпуска и пополнения с компенсациями. Перевёл интеграцию с эмитентом на API V2 за 3 дня.',
        'Построил платёжную платформу с несколькими провайдерами: новый провайдер подключается без изменения ядра, переключение на резервного не выставляет повторный счёт.',
        'Обеспечил денежную консистентность: идемпотентность, webhook-inbox, optimistic concurrency на балансе, сверка статусов с провайдерами. Исключены двойные списания и потерянные оплаты.',
        'Написал платформу автодеплоя для 25+ сервисов (гейты, связанные откаты, smoke-проверки) и Telegram-мониторинг сбоев.',
      ],
    },
    {
      company: 'Finstar Financial Group',
      position: 'Разработчик ПО',
      startMonth: '2025-06',
      endMonth: '2026-02',
      achievements: [
        'Разрабатывал сервисы расчёта кредитных условий и обработки транзакций для высоконагруженной BNPL-платформы (микросервисы, event-driven).',
        'Участвовал во внедрении Kafka для обработки транзакций и асинхронного обмена событиями.',
        'Перевёл часть межсервисного взаимодействия на gRPC, снизив задержки.',
        'Поднял покрытие unit- и интеграционными тестами, сократив регрессии при релизах.',
      ],
    },
    {
      company: 'АО «ЗМС Знамя Труда»',
      position: 'Разработчик ПО',
      startMonth: '2022-04',
      endMonth: '2025-06',
      achievements: [
        'Спроектировал и внедрил IoT-сервис сбора данных со станков (MQTT + InfluxDB): доступность данных выросла с 60 % до 95 %.',
        'Разработал веб-сервис учёта производственных партий на ASP.NET Core вместо Excel-отчётов: подготовка сменного задания сократилась с 2 часов до 20 минут.',
        'Сделал панель для технологов на Blazor и Telegram-уведомления о простоях: время реакции на инциденты сократилось на 40 %.',
        'Интегрировал с ERP склад (API-сервис, штрихкодирование) и CAD (SolidWorks API).',
        'Ускорил вдвое SQL-запросы отчётов ERP, внедрил кеширование на Redis, централизованное логирование и CI/CD.',
      ],
    },
  ],

  projects: [
    {
      name: 'PayWay',
      description: 'Платёжная платформа оплаты игр и зарубежных сервисов',
      url: 'https://payway.io',
    },
    {
      name: '4.cards',
      description: 'Сервис выпуска виртуальных валютных карт',
      url: 'https://4.cards',
    },
    {
      name: 'Цифровая визитка',
      description:
        'Это приложение: NestJS, GraphQL, Prisma, Docker. Поля схемы сверх примера из задания добавлены намеренно, обоснование — в README',
      url: 'https://github.com/sergeyQe/TestForITSolutions',
    },
    {
      name: 'IoT-сервис сбора данных со станков',
      description: 'Внутренняя система завода «Знамя Труда»',
      url: null,
    },
  ],
};
