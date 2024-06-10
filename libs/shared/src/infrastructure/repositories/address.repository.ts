import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { AddressDocumet } from '../models/address.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserDocument } from '../models/user.document';

@Injectable()
export class AddressRepository extends AbstractRepository<AddressDocumet> {
  constructor(
    @InjectModel(AddressDocumet.name)
    readonly addressModel: Model<AddressDocumet>,
  ) {
    super(addressModel);
  }

  async findManyPopulated(filterQuery: FilterQuery<AddressDocumet>) {
    return await this.addressModel
      .find(filterQuery)
      .populate({
        path: 'user',
        model: UserDocument.name,
        select: 'firstname lastname email mobile',
      })
      .sort({ createdAt: 'desc' })
      .lean<AddressDocumet>(true);
  }

  async findOneByIdPopulated(_id: string) {
    return await this.addressModel
      .findById(_id)
      .populate({
        path: 'user',
        model: UserDocument.name,
        select: 'firstname lastname email mobile',
      })
      .sort({ createdAt: 'desc' })
      .lean<AddressDocumet>(true);
  }
}
