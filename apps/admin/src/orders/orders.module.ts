import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import {
  InventoryDocument,
  InventorySchema,
  OrderDocument,
  OrderItemDocument,
  OrderItemSchema,
  OrderSchema,
  PaymentDocument,
  PaymentSchema,
  UserDocument,
  UserSchema,
} from '@app/shared/infrastructure/models';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { SERVICE_NAMES } from '@app/shared/domain/enums';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import {
  InventoryRepository,
  OrderItemRepository,
  OrderRepository,
  PaymentRepository,
  UserRepository,
} from '@app/shared/infrastructure/repositories';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: OrderItemDocument.name, schema: OrderItemSchema },
      { name: InventoryDocument.name, schema: InventorySchema },
      { name: UserDocument.name, schema: UserSchema },
      { name: PaymentDocument.name, schema: PaymentSchema },
    ]),
    ConfigModule.forRoot({
      envFilePath: 'apps/admin/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
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
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    OrderRepository,
    OrderItemRepository,
    UserRepository,
    InventoryRepository,
    PaymentRepository,
  ],
})
export class OrdersModule {}
