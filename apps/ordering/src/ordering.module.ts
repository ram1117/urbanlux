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
import {
  OrderDocument,
  OrderSchema,
} from '@app/shared/infrastructure/models/order.document';
import {
  OrderItemDocument,
  OrderItemSchema,
} from '@app/shared/infrastructure/models/orderitem.document';
import { OrderRepository } from '@app/shared/infrastructure/repositories/order.repository';
import { OrderItemRepository } from '@app/shared/infrastructure/repositories/orderitem.repository';
import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import {
  MerchandiseDocument,
  MerchandiseSchema,
} from '@app/shared/infrastructure/models/merchandise.document';
import {
  InventoryDocument,
  InventorySchema,
} from '@app/shared/infrastructure/models/inventory.document';
import {
  BrandDocument,
  BrandSchema,
} from '@app/shared/infrastructure/models/brand.document';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { AddressRepository } from '@app/shared/infrastructure/repositories/address.repository';
import {
  AddressDocumet,
  AddressSchema,
} from '@app/shared/infrastructure/models/address.document';

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
    ]),
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
    OrderRepository,
    OrderItemRepository,
    MerchandiseRepository,
    InventoryRepository,
    AddressRepository,
  ],
})
export class OrderingModule {}
