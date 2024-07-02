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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';
import {
  OrderDocument,
  OrderSchema,
  OrderItemDocument,
  OrderItemSchema,
  MerchandiseDocument,
  MerchandiseSchema,
  InventoryDocument,
  InventorySchema,
  BrandDocument,
  BrandSchema,
  AddressDocumet,
  AddressSchema,
  PaymentDocument,
  PaymentSchema,
  CategoryDocument,
  CategorySchema,
} from '@app/shared/infrastructure/models';
import { PaymentsService } from './payments.service';
import {
  AddressRepository,
  InventoryRepository,
  MerchandiseRepository,
  OrderItemRepository,
  OrderRepository,
  PaymentRepository,
} from '@app/shared/infrastructure/repositories';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: OrderItemDocument.name, schema: OrderItemSchema },
      { name: MerchandiseDocument.name, schema: MerchandiseSchema },
      { name: InventoryDocument.name, schema: InventorySchema },
      { name: BrandDocument.name, schema: BrandSchema },
      { name: AddressDocumet.name, schema: AddressSchema },
      { name: PaymentDocument.name, schema: PaymentSchema },
      { name: CategoryDocument.name, schema: CategorySchema },
    ]),
    LoggerModule,
    ExceptionsModule,
    ConfigModule.forRoot({
      load: [RabbitMQConfig],
      envFilePath: 'apps/ordering/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAMES.AUTH,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          configService.getOrThrow('authconfig'),
      },
      {
        name: SERVICE_NAMES.NOTIFICATION,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          configService.getOrThrow('notificationsconfig'),
      },
    ]),
    AddressModule,
  ],
  controllers: [OrderingController],
  providers: [
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
    OrderingService,
    PaymentsService,
    OrderRepository,
    OrderItemRepository,
    MerchandiseRepository,
    InventoryRepository,
    AddressRepository,
    PaymentRepository,
  ],
})
export class OrderingModule {}
