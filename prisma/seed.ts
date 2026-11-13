import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seedData } from './seed-data.js';
import { seedDatabase } from './seed-database.js';

// Обёртка для команды `npx prisma db seed`: вся логика — в seedDatabase, её же вызывает тест
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Не задана переменная окружения DATABASE_URL');
}

// Клиент живёт только на время заливки и отключается даже при ошибке
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
try {
  await seedDatabase(prisma, seedData);
  console.log('Данные визитки записаны в базу');
} finally {
  await prisma.$disconnect();
}
