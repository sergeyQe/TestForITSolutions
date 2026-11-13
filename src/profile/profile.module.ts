import { Module } from '@nestjs/common';
import { ProfileLoader } from './profile.loader.js';
import { ProfileRepository } from './profile.repository.js';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from './profile.service.js';

/** Профиль и его ссылки; здесь же корневой запрос profile */
@Module({
  providers: [
    ProfileResolver,
    ProfileLoader,
    ProfileService,
    ProfileRepository,
  ],
})
export class ProfileModule {}
