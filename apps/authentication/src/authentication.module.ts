import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { FirebaseAdmin } from './infrastructure/config/firebase.config';
import { UserModule } from './user/user.module';
import {
  UserDocument,
  UserSchema,
} from '@app/shared/infrastructure/models/user.document';
import { UserRepository } from '@app/shared/infrastructure/repositories/user.repository';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import RabbitMQConfig from '@app/shared/infrastructure/config/messagequeue.config';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
    ExceptionsModule,
    ConfigModule.forRoot({
      load: [RabbitMQConfig],
      envFilePath: 'apps/authentication/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        FIREBASE_CONFIG: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
      }),
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    AuthenticationService,
    FirebaseAdmin,
    UserRepository,
  ],
  exports: [],
})
export class AuthenticationModule {}
