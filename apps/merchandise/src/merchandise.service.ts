import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './infrastructure/dtos/merchandise.dto';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { UpdateInventoryDto } from './infrastructure/dtos/updateInventory.dto';

@Injectable()
export class MerchandiseService {
  constructor(
    private readonly merchRepo: MerchandiseRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly exceptions: ExceptionsService,
  ) {}

  async findMany() {
    return await this.merchRepo.findMany();
  }

  async create(createItemDto: CreateItemDto) {
    return await this.merchRepo.create({ ...createItemDto, inventory: [] });
  }

  async findById(_id: string) {
    const item = await this.merchRepo.findOnePopulated(_id);
    if (!item)
      this.exceptions.badReqeustException({
        message: 'Merchandise item not found',
      });
    return item;
  }

  async updateById(_id: string, updateItemDto: Partial<CreateItemDto>) {
    const item = await this.merchRepo.updateById(_id, updateItemDto);
    if (!item)
      this.exceptions.badReqeustException({
        message: 'Merchandise item not found',
      });
    return item;
  }

  async deleteById(_id: string) {
    const item = await this.merchRepo.findById(_id);
    if (!item)
      this.exceptions.badReqeustException({
        message: 'Merchandise item not found',
      });

    await this.inventoryRepo.deleteMany({ merchandise: item._id.toString() });
    await this.merchRepo.deleteById(item._id.toString());

    return { message: 'Item deleted successfully' };
  }

  async updateInventory(updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepo.updateById(
      updateInventoryDto._id,
      {
        stock: updateInventoryDto.stock,
      },
    );
    if (!inventory)
      this.exceptions.badReqeustException({
        message: 'Inventory item not found',
      });
    return inventory;
  }
}
