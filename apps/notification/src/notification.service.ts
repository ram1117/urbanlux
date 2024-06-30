// import { USER_ROLES } from '@app/shared/domain/enums';
import { UserRepository } from '@app/shared/infrastructure/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private readonly userRepo: UserRepository) {}

  async sendUserEmail(payload: any) {
    return payload;
  }

  async sendUserAdmin(payload: any) {
    // const admin = await this.userRepo.findOne({ role: USER_ROLES.admin });
    return payload;
  }
}
