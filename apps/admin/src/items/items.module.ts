import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import * as Joi from 'joi';
import {
  BrandDocument,
  BrandSchema,
  CategoryDocument,
  CategorySchema,
  InventoryDocument,
  InventorySchema,
  MerchandiseDocument,
  MerchandiseSchema,
} from '@app/shared/infrastructure/models';
import {
  BrandRepository,
  CategoryRepository,
  InventoryRepository,
  MerchandiseRepository,
} from '@app/shared/infrastructure/repositories';

import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: MerchandiseDocument.name, schema: MerchandiseSchema },
      { name: InventoryDocument.name, schema: InventorySchema },
      { name: BrandDocument.name, schema: BrandSchema },
      { name: CategoryDocument.name, schema: CategorySchema },
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
    ]),
  ],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    MerchandiseRepository,
    InventoryRepository,
    BrandRepository,
    CategoryRepository,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
  ],
})
export class ItemsModule {}
