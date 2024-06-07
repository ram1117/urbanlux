import { NestFactory } from '@nestjs/core';
import { MerchandiseModule } from './merchandise.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(MerchandiseModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new MongoExceptionsFilter());
  await app.listen(3001);
}
bootstrap();
