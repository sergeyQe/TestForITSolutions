import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  /** Интерфейс визитки — Apollo Sandbox, поэтому корень сайта ведёт на него */
  @Get()
  @Redirect('/graphql', 302)
  redirectToSandbox(): void {}
}
