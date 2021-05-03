import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('bestRoute/:origin/:destiny')
  bestRoute(@Param('origin') origin, @Param('destiny') destiny) {
    return this.appService.cheaperRoute(
      origin.toUpperCase(),
      destiny.toUpperCase(),
    );
  }
}
