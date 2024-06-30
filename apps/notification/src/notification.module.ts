import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import RabbitMQConfig from '@app/shared/infrastructure/config/messagequeue.config';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { DatabaseModule } from '@app/shared/infrastructure/database/database.module';
import { UserDocument, UserSchema } from '@app/shared/infrastructure/models';
import { UserRepository } from '@app/shared/infrastructure/repositories';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ExceptionsModule,
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/notification/.env',
      load: [RabbitMQConfig],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
        FRONT_END_URL_ADMIN: Joi.string().required(),
        SMTP_USER: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_OAUTH_REFRESH_TOKEN: Joi.string().required(),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: configService.getOrThrow('SMTP_USER'),
            clientId: configService.getOrThrow('GOOGLE_OAUTH_CLIENT_ID'),
            clientSecret: configService.getOrThrow(
              'GOOGLE_OAUTH_CLIENT_SECRET',
            ),
            refreshToken: configService.getOrThrow(
              'GOOGLE_OAUTH_REFRESH_TOKEN',
            ),
          },
        },
        defaults: { from: `${configService.get('SMTP_USER')}` },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, UserRepository],
})
export class NotificationModule {}
