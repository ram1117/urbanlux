import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { OrderDocument } from '../models/order.document';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderDocument> {
  constructor(
    @InjectModel(OrderDocument.name) orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }
}
