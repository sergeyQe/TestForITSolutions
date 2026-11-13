import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Link, toLinkModel } from './models/link.model.js';
import { Profile, toProfileModel } from './models/profile.model.js';
import { ProfileLoader } from './profile.loader.js';
import { ProfileNotFoundError } from './profile.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileLoader: ProfileLoader) {}

  @Query(() => Profile, {
    description:
      'Профиль специалиста — корень визитки. Если база не заполнена, вернётся ошибка с кодом NOT_FOUND',
  })
  async profile(@Context() context: object): Promise<Profile> {
    try {
      return toProfileModel(await this.profileLoader.loadProfile(context));
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
  async links(
    @Parent() profile: Profile,
    @Context() context: object,
  ): Promise<Link[]> {
    const links = await this.profileLoader.loadLinks(context, profile.id);
    return links.map(toLinkModel);
  }
}
