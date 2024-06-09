import { UserRepository } from '@app/shared/infrastructure/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './infrastructure/dtos/createuser.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async find(uid: string) {
    return await this.userRepo.findOne({ uid });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepo.create(createUserDto);
  }
}
