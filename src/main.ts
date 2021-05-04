import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { CliService } from './cli.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  new AppService().readRoutesInput();
  await app.listen(3000);
  new CliService().run();
}
bootstrap();
