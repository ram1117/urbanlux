import { OrderDocument } from '@app/shared/infrastructure/models';
import {
  OrderItemRepository,
  OrderRepository,
} from '@app/shared/infrastructure/repositories';
import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly orderItemRepo: OrderItemRepository,
  ) {}

  async findMany(filterQuery: FilterQuery<OrderDocument> = {}) {
    return await this.orderRepo.findMany(filterQuery, { updatedAt: 1 });
  }
}
