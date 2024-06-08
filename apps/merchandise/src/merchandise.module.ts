import { Module } from '@nestjs/common';
import { MerchandiseController } from './merchandise.controller';
import { MerchandiseService } from './merchandise.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  MerchandiseDocument,
  MerchandiseSchema,
} from '@app/shared/infrastructure/models/merchandise.document';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import {
  InventoryDocument,
  InventorySchema,
} from '@app/shared/infrastructure/models/inventory.document';
import {
  BrandDocument,
  BrandSchema,
} from '@app/shared/infrastructure/models/brand.document';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { CategoryRepository } from '@app/shared/infrastructure/repositories/category.repository';
import {
  CategoryDocument,
  CategorySchema,
} from '@app/shared/infrastructure/models/category.document';

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
      envFilePath: 'apps/merchandise/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [MerchandiseController],
  providers: [
    MerchandiseService,
    MerchandiseRepository,
    BrandRepository,
    CategoryRepository,
  ],
  exports: [MerchandiseService],
})
export class MerchandiseModule {}
