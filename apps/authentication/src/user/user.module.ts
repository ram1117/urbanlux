import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '@app/shared/infrastructure/repositories/user.repository';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import {
  UserDocument,
  UserSchema,
} from '@app/shared/infrastructure/models/user.document';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
    ExceptionsModule,
    ConfigModule.forRoot({
      envFilePath: 'apps/authentication/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: SERVICE_NAMES.AUTH,
        useFactory: (configService: ConfigService) =>
          configService.getOrThrow('authconfig'),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    UserService,
    UserRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
