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
  SizeDocument,
  SizeDocumentSchema,
} from '@app/shared/infrastructure/models/size.document';
import { SizeRepository } from '@app/shared/infrastructure/repositories/size.repository';
import {
  InventoryDocument,
  InventorySchema,
} from '@app/shared/infrastructure/models/inventory.document';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';

@Module({
  imports: [
    ExceptionsModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MerchandiseDocument.name, schema: MerchandiseSchema },
      { name: SizeDocument.name, schema: SizeDocumentSchema },
      { name: InventoryDocument.name, schema: InventorySchema },
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
    SizeRepository,
    InventoryRepository,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
  ],
})
export class MerchandiseModule {}
