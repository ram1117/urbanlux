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
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    DatabaseModule,
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
