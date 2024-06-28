import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ItemsModule } from './items/items.module';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/shared/domain/enums';
import { OrdersModule } from './orders/orders.module';
import RabbitMQConfig from '@app/shared/infrastructure/config/messagequeue.config';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    DatabaseModule,
    DatabaseModule.forFeature([]),
    ConfigModule.forRoot({
      load: [RabbitMQConfig],
      envFilePath: 'apps/admin/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAMES.AUTH,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          configService.getOrThrow('authconfig'),
      },
    ]),
    CategoryModule,
    BrandModule,
    ItemsModule,
    OrdersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
