import { NestFactory } from '@nestjs/core';
import { OrderingModule } from './ordering.module';
import { ValidationPipe } from '@nestjs/common';
import rawBodyMiddleware from './infrastructure/middlewares/rawbody.middleware';
import { ConfigService } from '@nestjs/config';

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
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.getOrThrow('FRONT_END_URL'),
    credentials: true,
  });
  app.use(rawBodyMiddleware()), await app.listen(3004);
}
bootstrap();
