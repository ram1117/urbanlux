import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
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
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { SeedService } from './seed/seed.service';

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
  controllers: [AdminController],
  providers: [
    AdminService,
    MerchandiseRepository,
    InventoryRepository,
    BrandRepository,
    SeedService,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
  ],
})
export class AdminModule {}
