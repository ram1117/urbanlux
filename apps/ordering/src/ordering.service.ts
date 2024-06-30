import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './infrastructure/dtos/createorder.dto';
import { OrderRepository } from '@app/shared/infrastructure/repositories/order.repository';
import { OrderItemRepository } from '@app/shared/infrastructure/repositories/orderitem.repository';
import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { ORDER_STATUS, PAYMENT_STATUS } from '@app/shared/domain/enums';
import { AddressRepository } from '@app/shared/infrastructure/repositories/address.repository';
import { PaymentsService } from './payments.service';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { PaymentRepository } from '@app/shared/infrastructure/repositories';

@Injectable()
export class OrderingService {
  constructor(
    private readonly exceptions: ExceptionsService,
    private readonly orderRepo: OrderRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly merchRepo: MerchandiseRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly addressRepo: AddressRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly paymentService: PaymentsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userid: string) {
    let total = 0;
    const orderitems = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const merchandise = await this.merchRepo.findOnePopulated(
          item.merchandise,
        );
        const inventory = await this.inventoryRepo.findById(item.inventory);
        const subtotal = item.quantity * inventory.price;
        total += subtotal;

        return await this.orderItemRepo.create({
          ...item,
          size: inventory.size,
          subtotal,
          user: userid,
          merchandise: merchandise._id.toString(),
          merchandise_name: merchandise.name,
          merchandise_thumbnail: merchandise.thumbnail,
          inventory: inventory._id.toString(),
          available: null,
        });
      }),
    );
    const delivery_address = await this.addressRepo.findById(
      createOrderDto.delivery_address,
    );
    const billing_address = await this.addressRepo.findById(
      createOrderDto.billing_address,
    );
    const intent = await this.paymentService.createIntent(
      userid,
      total,
      billing_address,
    );
    if (!intent) {
      this.exceptions.internalServerException({
        message: 'Unable to create payment intent',
      });
    }

    const order = await this.orderRepo.create({
      items: orderitems,
      address: delivery_address,
      total,
      payment_status: PAYMENT_STATUS.PENDING,
      order_status: ORDER_STATUS.PLACED,
      user: userid,
      cancelled: false,
      comments: ['Order placed'],
      tracking_id: null,
    });
    await this.paymentRepo.create({
      order_id: order._id.toString(),
      payment_intent: intent,
      refund_id: null,
    });
    return order;
  }

  async findMany(userid: string) {
    return await this.orderRepo.findManyPopulated({ user: userid });
  }

  async findOne(userid: string, _id: string) {
    return await this.orderRepo.findOne({ user: userid, _id });
  }
}
