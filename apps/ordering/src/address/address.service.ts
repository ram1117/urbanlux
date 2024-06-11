import { AddressRepository } from '@app/shared/infrastructure/repositories/address.repository';
import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './infrastructure/dtos/createaddress.dto';
import { UserRepository } from '@app/shared/infrastructure/repositories/user.repository';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async findMany(userid: string) {
    return await this.addressRepository.findManyPopulated({ user: userid });
  }

  async findOne(_id: string) {
    return await this.addressRepository.findOneByIdPopulated(_id);
  }

  async create(_id: string, createAddressDto: CreateAddressDto) {
    const user = await this.userRepo.findById(_id);
    return await this.addressRepository.create({
      ...createAddressDto,
      fullname: `${user.firstname} ${user.lastname}`,
      user: _id,
    });
  }
}
