import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.getOrThrow('FRONT_END_URL'),
    credentials: true,
  });
  await app.listen(3008);
}
bootstrap();
