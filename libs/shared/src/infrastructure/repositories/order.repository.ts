import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { OrderDocument } from '../models/order.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrderItemDocument, UserDocument } from '../models';

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
      .select('items total payment_status createdAt updatedAt order_status')
      .sort(sortBy)
      .lean<OrderDocument>(true);
  }

  async findManyWithUser(
    filterQuery: FilterQuery<OrderDocument> = {},
    sortBy: any = { updatedAt: 1 },
  ) {
    return this.orderModel
      .find(filterQuery)
      .select('items total payment_status createdAt updatedAt order_status')
      .sort(sortBy)
      .populate({
        path: 'user',
        model: UserDocument.name,
        select: 'firstname email',
      })
      .lean<OrderDocument>(true);
  }

  async findOnePopulated(id: string) {
    return this.orderModel
      .findById(id)
      .populate({
        path: 'user',
        model: UserDocument.name,
        select: 'firstname email',
      })
      .populate({ path: 'items', model: OrderItemDocument.name })
      .lean<OrderDocument>(true);
  }
}
