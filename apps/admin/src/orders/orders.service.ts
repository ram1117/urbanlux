import {
  OrderDocument,
  OrderItemDocument,
  UserDocument,
} from '@app/shared/infrastructure/models';
import {
  InventoryRepository,
  OrderItemRepository,
  OrderRepository,
  PaymentRepository,
  UserRepository,
} from '@app/shared/infrastructure/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { FilterOrderDto } from './infrastructure/dtos/filterorder.dto';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  SERVICE_NAMES,
  SERVICE_PATTERNS,
} from '@app/shared/domain/enums';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UpdateDispatchDto } from './infrastructure/dtos/updatedispatch.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  private readonly stripeClient = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    { apiVersion: '2024-04-10' },
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly orderRepo: OrderRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly userRepo: UserRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly paymentRepo: PaymentRepository,
    @Inject(SERVICE_NAMES.NOTIFICATION)
    private notificationService: ClientProxy,
  ) {}

  async findOne(id: string) {
    return await this.orderRepo.findOnePopulated(id);
  }

  async findMany(filterQuery: FilterQuery<OrderDocument> = {}) {
    return await this.orderRepo.findManyWithUser(filterQuery, { updatedAt: 1 });
  }

  async findManyFilter(
    filterQuery: FilterQuery<OrderDocument> = {},
    filterOrderDto: FilterOrderDto,
  ) {
    let query = { ...filterQuery };
    if (
      filterOrderDto.user_email.length > 0 ||
      filterOrderDto.user_name.length > 0
    ) {
      let user: UserDocument | undefined = undefined;
      if (filterOrderDto.user_email) {
        user = await this.userRepo.findOne({
          email: filterOrderDto.user_email,
        });
      } else if (filterOrderDto.user_name) {
        user = await this.userRepo.findOne({
          firstname: filterOrderDto.user_name,
        });
      }
      query = { ...query, user: user._id.toString() };
    }
    if (filterOrderDto.order_id) {
      query = {
        ...query,
        _id: filterOrderDto.order_id,
      };
    }
    if (filterOrderDto.order_date) {
      const toDate = new Date(
        new Date(filterOrderDto.order_date).getTime() + 1 * 24 * 60 * 60 * 1000,
      );
      const fromDate = new Date(
        new Date(filterOrderDto.order_date).getTime() - 1 * 24 * 60 * 60 * 1000,
      );
      query = {
        ...query,
        updatedAt: { $lte: toDate, $gte: fromDate },
      };
    }
    return await this.orderRepo.findManyWithUser(query);
  }

  async createRefund(order_id: string, refundamount: number = 0) {
    const payment = await this.paymentRepo.findOne({ order_id });
    const order = await this.orderRepo.findById(order_id);
    const refundValue = refundamount > 0 ? refundamount : order.total;

    const { id } = await this.stripeClient.refunds.create({
      payment_intent: payment.payment_intent,
      reason: 'requested_by_customer',
      amount: refundValue,
    });

    await this.paymentRepo.updateById(payment._id.toString(), {
      refund_id: id,
    });
  }

  async updateOrderStatus(orderid: string) {
    const order = await this.orderRepo.findById(orderid);
    const user = await this.userRepo.findById(order.user);
    const unavailableItems: OrderItemDocument[] = [];

    /* Check inventory for item availability and update inventory */

    order.items.map(async (item) => {
      const orderitem = await this.orderItemRepo.findById(item);
      const inventory = await this.inventoryRepo.findById(orderitem.inventory);
      const availability = inventory.stock >= orderitem.quantity;
      await this.orderItemRepo.updateById(item, {
        available: availability,
      });
      if (availability) {
        const newstock = inventory.stock - orderitem.quantity;
        await this.inventoryRepo.updateById(inventory._id.toString(), {
          stock: newstock,
        });
      } else unavailableItems.push(orderitem);
    });

    /* Cancel and refund full if all items are not available, partial refund otherwise */

    const comments = unavailableItems.map(
      (item) =>
        `Unfortunately, unable to fulfill order for Item: ${item.merchandise_name}-${item.quantity}`,
    );

    if (unavailableItems.length > 0) {
      if (unavailableItems.length === order.items.length) {
        await this.createRefund(order._id.toString(), order.total);
        const updatedOrder = await this.orderRepo.updateById(
          order._id.toString(),
          {
            payment_status: PAYMENT_STATUS.REFUNDCOMPLETE,
            order_status: ORDER_STATUS.SELLERCANCELLED,
            comments: [...comments, `Full refund initiated.`],
          },
        );
        this.notificationService.emit(
          { cmd: SERVICE_PATTERNS.NOTIFYUSER },
          {
            username: user.firstname,
            email: user.email,
            orderid: order._id.toString(),
            order_status: ORDER_STATUS.SELLERCANCELLED,
          },
        );
        return updatedOrder;
      } else {
        let refundAmount = 0;
        unavailableItems.forEach((item) => {
          refundAmount += item.subtotal;
        });
        await this.createRefund(order._id.toString(), refundAmount);
        const updatedOrder = await this.orderRepo.updateById(
          order._id.toString(),
          {
            payment_status: PAYMENT_STATUS.REFUNDPARTIAL,
            order_status: ORDER_STATUS.CONFIRMED,
            comments: [...comments, `Partial refund initiated.`],
          },
        );
        this.notificationService.emit(
          { cmd: SERVICE_PATTERNS.NOTIFYUSER },
          {
            username: user.firstname,
            email: user.email,
            orderid: order._id.toString(),
            order_status: ORDER_STATUS.SELLERCANCELLED,
          },
        );
        return updatedOrder;
      }
    }
    const updatedOrder = await this.orderRepo.updateById(order._id.toString(), {
      order_status: ORDER_STATUS.CONFIRMED,
      comments: ['Seller confirmed the order.'],
    });
    this.notificationService.emit(
      { cmd: SERVICE_PATTERNS.NOTIFYUSER },
      {
        username: user.firstname,
        email: user.email,
        orderid: order._id.toString(),
        order_status: ORDER_STATUS.CONFIRMED,
      },
    );
    return updatedOrder;
  }

  async updateDispatch(orderid: string, updateDispatchDto: UpdateDispatchDto) {
    const order = await this.orderRepo.findById(orderid);
    return this.orderRepo.updateById(order._id.toString(), {
      tracking_id: updateDispatchDto.tracking_id,
      order_status: ORDER_STATUS.DISPATCHED,
      comments: [`Order dispatched`],
    });
  }
}
