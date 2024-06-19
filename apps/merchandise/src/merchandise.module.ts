import { Module } from '@nestjs/common';
import { MerchandiseController } from './merchandise.controller';
import { MerchandiseService } from './merchandise.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
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
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import {
  BrandRepository,
  CategoryRepository,
  MerchandiseRepository,
} from '@app/shared/infrastructure/repositories';

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
        FRONT_END_URL: Joi.string().required(),
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
