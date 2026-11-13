# syntax=docker/dockerfile:1

# Стадия base. Общая основа остальных стадий: версия Node задана в одном месте
FROM node:24-alpine AS base
WORKDIR /app

# Стадия deps. Все зависимости: нужны для сборки, миграций и seed
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Стадия build. Генерация клиента Prisma и сборка; к базе они не обращаются, её адрес здесь не нужен.
# Из этой же стадии запускается контейнер migrate: в ней есть Prisma CLI, tsx, схема, миграции и данные визитки
FROM deps AS build
COPY . .
RUN npm run build

# Стадия prod-deps. Только зависимости для запуска.
# Одного --omit=dev мало: Prisma CLI и TypeScript — необязательные peer-зависимости @prisma/client,
# их убирает --omit=optional. Приложению в работе они не нужны, а node_modules без них — 160 МБ вместо 440
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --omit=optional

# Стадия runtime. Образ приложения: без исходников и инструментов сборки, не от root
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# package.json нужен и в работе: его "type": "module" объявляет файлы в dist ES-модулями
COPY package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
