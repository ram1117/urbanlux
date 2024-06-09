import { Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  createUser() {
    return this.authenticationService.create();
  }

  @Post('signin')
  signinUser() {}
}
