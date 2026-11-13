import { unwrapResolverError } from '@apollo/server/errors';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { GraphQLFormattedError } from 'graphql';
import type { Env } from './env.schema.js';
import { FULL_PROFILE_QUERY } from './full-profile-query.js';

const logger = new Logger('GraphQL');

const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
const MAX_QUERY_TOKENS = 1000;

/**
 * Непредвиденные ошибки (в том числе ошибки Prisma с текстом запроса) наружу не уходят:
 * клиент получает общее сообщение, подробности остаются в журнале.
 */
function formatError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  // Ожидаемые ошибки (NOT_FOUND, ошибки в тексте запроса) отдаются клиенту как есть
  if (formattedError.extensions?.code !== INTERNAL_SERVER_ERROR) {
    return formattedError;
  }

  // Ошибка без пути возникла до резолверов — например, мутация в схеме без мутаций.
  // Это ошибка в запросе клиента, а не сбой сервера
  if (!formattedError.path) {
    return {
      message: formattedError.message,
      extensions: { code: 'BAD_REQUEST' },
    };
  }

  // Исходная ошибка со стеком — только в журнал
  const cause = unwrapResolverError(error);
  logger.error(cause instanceof Error ? (cause.stack ?? cause.message) : cause);

  return {
    message: 'Внутренняя ошибка сервера',
    path: formattedError.path,
    extensions: { code: INTERNAL_SERVER_ERROR },
  };
}

export function createGraphqlOptions(
  config: ConfigService<Env, true>,
): ApolloDriverConfig {
  const isProduction = config.get('NODE_ENV', { infer: true }) === 'production';

  return {
    // Схема строится из кода. В разработке она сохраняется в файл, чтобы её можно было прочитать
    // без запуска; в продакшене — только в памяти: контейнер работает без прав на запись
    autoSchemaFile: isProduction ? true : 'schema.gql',
    sortSchema: true,

    // Apollo Sandbox — интерфейс визитки, поэтому он и схема открыты и в продакшене.
    // Без явного плагина и introspection Apollo Server при NODE_ENV=production их отключает
    graphiql: false,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        document: FULL_PROFILE_QUERY,
        embed: { runTelemetry: false, endpointIsEditable: false },
      }),
    ],

    // Потолок размера запроса: полный запрос — 38 токенов, запрос схемы из Sandbox — несколько сотен.
    // Не даёт одним запросом повторить корневое поле тысячи раз под разными псевдонимами
    parseOptions: { maxTokens: MAX_QUERY_TOKENS },

    // Трассировка стека и тексты непредвиденных ошибок клиенту не отдаются в любом окружении
    includeStacktraceInErrorResponses: false,
    formatError,
  };
}
