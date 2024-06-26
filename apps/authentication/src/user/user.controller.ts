import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { CurrentUser } from '@app/shared/infrastructure/decorators/currentuser.decorator';
import { RolesGuard } from '@app/shared/infrastructure/guards/roles.guard';
import { Roles } from '@app/shared/infrastructure/decorators/roles.decorator';
import { USER_ROLES } from '@app/shared/domain/enums';
import { UpdateUserDto } from './infrastructure/dtos/updateuser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles([USER_ROLES.admin, USER_ROLES.user])
  @UseGuards(AuthGuard, RolesGuard)
  getUser(@CurrentUser() user: any) {
    return this.userService.find({ _id: user._id });
  }

  @Post()
  @Roles([USER_ROLES.user])
  @UseGuards(AuthGuard, RolesGuard)
  updateUser(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(user.id, updateUserDto);
  }
}
