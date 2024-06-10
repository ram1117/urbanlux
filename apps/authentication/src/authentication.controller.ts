import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupUserDto } from './infrastructure/dtos/signupuser.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SERVICE_PATTERNS } from '@app/shared/domain/enums';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  createUser(@Body() signupUserDto: SignupUserDto) {
    return this.authenticationService.create(signupUserDto);
  }

  @MessagePattern({ cmd: SERVICE_PATTERNS.AUTH })
  validateUser(@Payload() payload: any) {
    return this.authenticationService.authenticate(payload.Authentication);
  }
}
