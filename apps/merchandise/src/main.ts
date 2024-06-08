import { NestFactory } from '@nestjs/core';
import { MerchandiseModule } from './merchandise.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MerchandiseModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(3001);
}
bootstrap();
