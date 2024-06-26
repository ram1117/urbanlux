import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice(configService.getOrThrow('authconfig'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('@nestjs/class-transformer'),
    }),
  );
  app.enableCors({
    origin: configService.getOrThrow('FRONT_END_URL'),
    credentials: true,
  });
  app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
