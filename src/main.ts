import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
const logger = new Logger('App Service');
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  logger.verbose("Server listening on port 3000");
}
bootstrap();
