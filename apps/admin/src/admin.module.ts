import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    DatabaseModule,
    DatabaseModule.forFeature([]),
    ConfigModule.forRoot({
      envFilePath: 'apps/admin/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
      }),
    }),
    CategoryModule,
    BrandModule,
    ItemsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
