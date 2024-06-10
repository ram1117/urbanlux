import { AddressRepository } from '@app/shared/infrastructure/repositories/address.repository';
import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from '../infrastructure/dtos/createaddress.dto';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async findMany(userid: string) {
    return await this.addressRepository.findManyPopulated({ user: userid });
  }

  async findOne(_id: string) {
    return await this.addressRepository.findOneByIdPopulated(_id);
  }

  async create(_id: string, createAddressDto: CreateAddressDto) {
    return await this.addressRepository.create({
      ...createAddressDto,
      user: _id,
    });
  }
}
