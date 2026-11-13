import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // У пакета graphql две сборки: CommonJS и ESM. Node всегда берёт первую, Vite по умолчанию — вторую.
    // С двумя копиями @nestjs/graphql не узнаёт скаляр Date (проверка instanceof), поэтому здесь — как в Node
    alias: [{ find: /^graphql$/, replacement: 'graphql/index.js' }],
  },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.spec.ts'],
    // Тесты идут на настоящей PostgreSQL: первый запуск скачивает образ и поднимает контейнер
    hookTimeout: 180_000,
    testTimeout: 30_000,
  },
});
