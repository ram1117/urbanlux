import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import {
  AddressDocumet,
  AddressSchema,
} from '@app/shared/infrastructure/models/address.document';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import RabbitMQConfig from '@app/shared/infrastructure/config/messagequeue.config';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { AddressRepository } from '@app/shared/infrastructure/repositories/address.repository';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import {
  UserDocument,
  UserSchema,
} from '@app/shared/infrastructure/models/user.document';
import { UserRepository } from '@app/shared/infrastructure/repositories/user.repository';

@Module({
  imports: [
    ExceptionsModule,
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: AddressDocumet.name, schema: AddressSchema },
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [RabbitMQConfig],
      envFilePath: 'apps/ordering/.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAMES.AUTH,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          configService.getOrThrow('authconfig'),
      },
    ]),
  ],
  controllers: [AddressController],
  providers: [
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    AddressService,
    AddressRepository,
    UserRepository,
  ],
})
export class AddressModule {}
