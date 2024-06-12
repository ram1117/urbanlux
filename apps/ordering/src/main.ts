import { NestFactory } from '@nestjs/core';
import { OrderingModule } from './ordering.module';
import { ValidationPipe } from '@nestjs/common';
import rawBodyMiddleware from './infrastructure/middlewares/rawbody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(OrderingModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('@nestjs/class-transformer'),
    }),
  );
  app.use(rawBodyMiddleware()), await app.listen(3004);
}
bootstrap();
