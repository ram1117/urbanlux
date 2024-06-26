import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { OrderItemDocument } from '../models/orderitem.document';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderItemRepository extends AbstractRepository<OrderItemDocument> {
  constructor(
    @InjectModel(OrderItemDocument.name)
    orderItemModel: Model<OrderItemDocument>,
  ) {
    super(orderItemModel);
  }
}
