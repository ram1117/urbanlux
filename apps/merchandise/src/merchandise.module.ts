import { Module } from '@nestjs/common';
import { MerchandiseController } from './merchandise.controller';
import { MerchandiseService } from './merchandise.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import {
  MerchandiseDocument,
  MerchandiseSchema,
} from '@app/shared/infrastructure/models/merchandise.document';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import {
  InventoryDocument,
  InventorySchema,
} from '@app/shared/infrastructure/models/inventory.document';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import {
  BrandDocument,
  BrandSchema,
} from '@app/shared/infrastructure/models/brand.document';
import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { SeedService } from './seed/seed.service';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MerchandiseDocument.name, schema: MerchandiseSchema },
      { name: InventoryDocument.name, schema: InventorySchema },
      { name: BrandDocument.name, schema: BrandSchema },
    ]),
    ConfigModule.forRoot({
      envFilePath: 'apps/merchandise/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    CategoryModule,
    BrandModule,
  ],
  controllers: [MerchandiseController],
  providers: [
    MerchandiseService,
    MerchandiseRepository,
    InventoryRepository,
    BrandRepository,
    SeedService,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
  ],
  exports: [MerchandiseService],
})
export class MerchandiseModule {}
