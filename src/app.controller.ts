import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('updateRoute')
  updateRoutes(@Body() body) {
    if (!body.from || !body.to || !body.price) {
      return `You should inform "from", "to" and "price" at the body.`;
    }
    return this.appService.updateRoutes(body.from, body.to, body.price);
  }
}
