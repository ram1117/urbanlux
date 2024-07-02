import { UserRepository } from '@app/shared/infrastructure/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './infrastructure/dtos/createuser.dto';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { FilterQuery } from 'mongoose';
import { UserDocument } from '@app/shared/infrastructure/models/user.document';
import { UpdateUserDto } from './infrastructure/dtos/updateuser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly exceptions: ExceptionsService,
  ) {}

  async find(query: FilterQuery<UserDocument>) {
    const user = await this.userRepo.findOne(query);
    if (!user) {
      this.exceptions.notfoundException({ message: 'User not found' });
    }
    return user;
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepo.updateById(id, updateUserDto);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepo.create(createUserDto);
  }
}
