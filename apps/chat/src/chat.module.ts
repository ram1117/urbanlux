import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    ConfigModule.forRoot({
      envFilePath: 'apps/chat/.env',
      isGlobal: true,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
