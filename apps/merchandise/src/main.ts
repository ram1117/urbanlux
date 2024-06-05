import { NestFactory } from '@nestjs/core';
import { MerchandiseModule } from './merchandise.module';

async function bootstrap() {
  const app = await NestFactory.create(MerchandiseModule);
  await app.listen(3001);
}
bootstrap();
