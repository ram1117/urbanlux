import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { FirebaseAdmin } from './infrastructure/config/firebase.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ExceptionsModule,
    ConfigModule.forRoot({
      envFilePath: 'apps/authentication/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, FirebaseAdmin],
})
export class AuthenticationModule {}
