import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupUserDto } from './infrastructure/dtos/signupuser.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  createUser(@Body() signupUserDto: SignupUserDto) {
    return this.authenticationService.create(signupUserDto);
  }

  @Post('signin')
  signinUser() {}
}
