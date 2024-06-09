import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import {
  CategoryDocument,
  CategorySchema,
} from '@app/shared/infrastructure/models/category.document';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { MongoExceptionsFilter } from '@app/shared/infrastructure/filters/mongoexceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { CategoryRepository } from '@app/shared/infrastructure/repositories/category.repository';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';

@Module({
  imports: [
    ExceptionsModule,
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CategoryDocument.name, schema: CategorySchema },
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