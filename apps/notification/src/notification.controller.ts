import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SERVICE_PATTERNS } from '@app/shared/domain/enums';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern({ cmd: SERVICE_PATTERNS.NOTIFYUSER })
  async sendEmailUser(@Payload() payload: any) {
    await this.notificationService.sendUserEmail(payload);
  }

  @EventPattern({ cmd: SERVICE_PATTERNS.NOTIFYADMIN })
  async sendEmailAdmin() {
    console.log('admin mail sending');
    await this.notificationService.sendUserAdmin();
  }
}
