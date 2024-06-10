import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseGuard } from '@app/shared/infrastructure/guards/firebase.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(FirebaseGuard)
  getUser(_id: string) {
    return this.userService.find(_id);
  }
}
