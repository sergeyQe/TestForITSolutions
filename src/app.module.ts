import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller.js';
import { envSchema } from './config/env.schema.js';
import { createGraphqlOptions } from './config/graphql.config.js';
import { ExperienceModule } from './experience/experience.module.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { SkillsModule } from './skills/skills.module.js';

@Module({
  imports: [
    // Настройки окружения: при ошибке в переменных приложение не стартует
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    PrismaModule,
    HealthModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: createGraphqlOptions,
    }),
    // Каждый модуль области сам объявляет свои типы и поля графа
    ProfileModule,
    SkillsModule,
    ExperienceModule,
    ProjectsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
