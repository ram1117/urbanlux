import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './infrastructure/dtos/createorder.dto';
import { OrderRepository } from '@app/shared/infrastructure/repositories/order.repository';
import { OrderItemRepository } from '@app/shared/infrastructure/repositories/orderitem.repository';
import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { ORDER_STATUS, PAYMENT_STATUS } from '@app/shared/domain/enums';
import { AddressRepository } from '@app/shared/infrastructure/repositories/address.repository';

@Injectable()
export class OrderingService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly merchRepo: MerchandiseRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly addressRepo: AddressRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto, userid: string) {
    let total = 0;
    const orderitems = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const merchandise = await this.merchRepo.findOnePopulated(
          item.merchandise,
        );
        const inventory = await this.inventoryRepo.findById(item.inventory_id);
        const subtotal = item.quantity * inventory.price;
        total += subtotal;

        return await this.orderItemRepo.create({
          ...item,
          subtotal,
          status: ORDER_STATUS.PLACED,
          user: userid,
          merchandise: merchandise._id.toString(),
          inventory: inventory._id.toString(),
        });
      }),
    );
    const address = await this.addressRepo.findById(createOrderDto.address);
    return await this.orderRepo.create({
      items: orderitems,
      address: address,
      total,
      payment_status: PAYMENT_STATUS.PENDING,
      user: userid,
    });
  }

  async findMany(userid: string) {
    return await this.orderRepo.findMany({ user: userid });
  }

  async findOne(userid: string, _id: string) {
    return await this.orderRepo.findOne({ user: userid, _id });
  }

  async updateOne(orderItemId: string) {
    return await this.orderItemRepo.updateById(orderItemId, {
      status: ORDER_STATUS.CANCELLED,
    });
  }
}
