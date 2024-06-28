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
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: BrandDocument.name,
        schema: BrandSchema,
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAMES.AUTH,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          configService.getOrThrow('authconfig'),
      },
    ]),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    BrandRepository,
  ],
  exports: [BrandService],
})
export class BrandModule {}
