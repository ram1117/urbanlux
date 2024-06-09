import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  async create() {
    return 'user created';
  }
}
