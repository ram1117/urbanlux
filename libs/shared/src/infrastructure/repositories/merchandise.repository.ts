import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { InjectModel } from '@nestjs/mongoose';
import { MerchandiseDocument } from '../models/merchandise.document';
import { InventoryDocument } from '../models/inventory.document';
import { Model } from 'mongoose';
import { BrandDocument } from '../models/brand.document';

@Injectable()
export class MerchandiseRepository extends AbstractRepository<MerchandiseDocument> {
  constructor(
    @InjectModel(MerchandiseDocument.name)
    readonly merchandiseModel: Model<MerchandiseDocument>,
  ) {
    super(merchandiseModel);
  }

  async findOnePopulated(_id: string) {
    return await this.merchandiseModel
      .findById(_id)
      .populate({ path: 'inventory', model: InventoryDocument.name })
      .populate({ path: 'brand', model: BrandDocument.name })
      .lean<MerchandiseDocument>(true);
  }
}
