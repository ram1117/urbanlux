import { USER_ROLES } from '@app/shared/domain/enums';
import { UserRepository } from '@app/shared/infrastructure/repositories';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from './infrastructure/dto/payload.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  getTemplate: Record<string, string> = {
    placed: './neworder',
    confirmed: './confirmation',
    cancelled: './cancellation',
    'seller cancelled': './admincancellation',
    dispatched: './dispatch',
  };

  async sendUserEmail(payload: PayloadDto) {
    await this.mailerService.sendMail({
      to: payload.email,
      subject: 'Order Status update',
      template: this.getTemplate[payload.order_status],
      context: {
        name: payload.username,
        link: `${this.configService.get('FRONT_END_URL')}/account/orders/${payload.orderid}`,
      },
    });
  }

  async sendUserAdmin() {
    const admin = await this.userRepo.findOne({ role: USER_ROLES.admin });
    await this.mailerService.sendMail({
      to: admin.email,
      subject: 'New Order Alert',
      template: './neworder',
      context: {
        name: admin.firstname,
        link: this.configService.get('FRONT_END_URL_ADMIN'),
      },
    });
  }
}
