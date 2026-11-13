import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Link, toLinkModel } from './models/link.model.js';
import { Profile, toProfileModel } from './models/profile.model.js';
import { ProfileNotFoundError, ProfileService } from './profile.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, {
    description:
      'Профиль специалиста — корень визитки. Если база не заполнена, вернётся ошибка с кодом NOT_FOUND',
  })
  async profile(): Promise<Profile> {
    try {
      return toProfileModel(await this.profileService.getProfile());
    } catch (error) {
      // Пустая база — понятная клиенту ошибка с кодом NOT_FOUND, а не «внутренняя ошибка сервера»
      if (error instanceof ProfileNotFoundError) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      throw error;
    }
  }

  @ResolveField(() => [Link], {
    description: 'Ссылки на профессиональные ресурсы и контакты',
  })
  async links(@Parent() profile: Profile): Promise<Link[]> {
    const links = await this.profileService.getLinks(profile.id);
    return links.map(toLinkModel);
  }
}
