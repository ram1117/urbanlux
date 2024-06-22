import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { InjectModel } from '@nestjs/mongoose';
import { MerchandiseDocument } from '../models/merchandise.document';
import { InventoryDocument } from '../models/inventory.document';
import { FilterQuery, Model } from 'mongoose';
import { BrandDocument } from '../models/brand.document';
import { CategoryDocument } from '../models';

@Injectable()
export class MerchandiseRepository extends AbstractRepository<MerchandiseDocument> {
  constructor(
    @InjectModel(MerchandiseDocument.name)
    readonly merchandiseModel: Model<MerchandiseDocument>,
  ) {
    super(merchandiseModel);
  }

  async findManyPopulated(
    filterQuery: FilterQuery<MerchandiseDocument> = {},
    sortBy: any = {},
  ) {
    return await this.merchandiseModel
      .find(filterQuery)
      .sort(sortBy)
      .populate({ path: 'inventory', model: InventoryDocument.name })
      .populate({ path: 'brand', model: BrandDocument.name, select: 'name' })
      .populate({
        path: 'category',
        model: CategoryDocument.name,
        select: 'name',
      })
      .lean<MerchandiseDocument[]>(true);
  }

  async findManyPopulatedLimit(sortBy: any = { createdAt: 'descending' }) {
    return await this.merchandiseModel
      .find({}, { name: 1, brand: 1, thumbnail: 1, createdAt: 1 }, { limit: 5 })
      .sort(sortBy)
      .populate({ path: 'brand', model: BrandDocument.name, select: 'name' })
      .lean<MerchandiseDocument[]>(true);
  }

  async findOnePopulated(_id: string) {
    return await this.merchandiseModel
      .findById(_id)
      .populate({ path: 'inventory', model: InventoryDocument.name })
      .populate({ path: 'brand', model: BrandDocument.name, select: 'name' })
      .populate({
        path: 'category',
        model: CategoryDocument.name,
        select: 'name',
      })
      .lean<MerchandiseDocument>(true);
  }
}
