import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { OrderDocument } from '../models/order.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderDocument> {
  constructor(
    @InjectModel(OrderDocument.name) readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }

  async findManyPopulated(
    filterQuery: FilterQuery<OrderDocument> = {},
    sortBy: any = { updatedAt: 1 },
  ) {
    return this.orderModel
      .find(filterQuery)
      .select('items total payment_status createdAt updatedAt')
      .sort(sortBy)
      .lean<OrderDocument>(true);
  }
}
