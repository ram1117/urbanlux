import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import {
  BrandDocument,
  BrandSchema,
} from '@app/shared/infrastructure/models/brand.document';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: BrandDocument.name,
        schema: BrandSchema,
      },
    ]),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    BrandRepository,
  ],
})
export class BrandModule {}
