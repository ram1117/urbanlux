import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import {
  CategoryDocument,
  CategorySchema,
} from '@app/shared/infrastructure/models/category.document';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { CategoryRepository } from '@app/shared/infrastructure/repositories/category.repository';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: CategoryDocument.name, schema: CategorySchema },
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
  controllers: [CategoryController],
  providers: [
    CategoryService,
    { provide: APP_FILTER, useClass: MongoExceptionsFilter },
    CategoryRepository,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
