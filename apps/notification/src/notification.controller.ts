import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SERVICE_PATTERNS } from '@app/shared/domain/enums';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern({ cmd: SERVICE_PATTERNS.NOTIFYUSER })
  sendEmailUser(@Payload() payload: any) {
    return this.notificationService.sendUserEmail(payload);
  }

  @EventPattern({ cmd: SERVICE_PATTERNS.NOTIFYADMIN })
  sendEmailAdmin(@Payload() payload: any) {
    return this.notificationService.sendUserAdmin(payload);
  }
}
