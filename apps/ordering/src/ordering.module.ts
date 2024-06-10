import { Module } from '@nestjs/common';
import { OrderingController } from './ordering.controller';
import { OrderingService } from './ordering.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import RabbitMQConfig from '@app/shared/infrastructure/config/messagequeue.config';
import * as Joi from 'joi';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([]),
    LoggerModule,
    ExceptionsModule,
    ConfigModule.forRoot({
      load: [RabbitMQConfig],
      envFilePath: 'apps/ordering/.env',
      isGlobal: true,
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
    AddressModule,
  ],
  controllers: [OrderingController],
  providers: [
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    OrderingService,
  ],
})
export class OrderingModule {}
