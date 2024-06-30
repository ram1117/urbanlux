import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
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
    origin: [
      configService.getOrThrow('FRONT_END_URL'),
      configService.getOrThrow('FRONT_END_URL_ADMIN'),
    ],
    credentials: true,
  });
  app.setGlobalPrefix('admin');
  await app.listen(3002);
}
bootstrap();
