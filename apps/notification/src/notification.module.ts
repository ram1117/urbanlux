import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import RabbitMQConfig from '@app/shared/infrastructure/config/messagequeue.config';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { UserDocument, UserSchema } from '@app/shared/infrastructure/models';
import { UserRepository } from '@app/shared/infrastructure/repositories';

@Module({
  imports: [
    ExceptionsModule,
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      envFilePath: './apps/notification/.env',
      load: [RabbitMQConfig],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
        FRONT_END_URL_ADMIN: Joi.string().required(),
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, UserRepository],
})
export class NotificationModule {}
