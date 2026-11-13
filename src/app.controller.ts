import { Controller, Get, Redirect } from '@nestjs/common';

/** Корень сайта: перенаправление на интерфейс визитки */
@Controller()
export class AppController {
  /**
   * GET / → 302 на /graphql: интерфейс визитки — Apollo Sandbox, поэтому корень сайта ведёт на него.
   * Параметров нет, тело пустое: ответ целиком формирует декоратор Redirect.
   */
  @Get()
  @Redirect('/graphql', 302)
  redirectToSandbox(): void {}
}
