import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice(configService.getOrThrow('notificationsconfig'));
  await app.startAllMicroservices();
}
bootstrap();
