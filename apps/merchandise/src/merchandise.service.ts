import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './infrastructure/dtos/merchandise.dto';
import { SizeRepository } from '@app/shared/infrastructure/repositories/size.repository';
import { CreateSizeDto } from './infrastructure/dtos/size.dto';
import { InventoryRepository } from '@app/shared/infrastructure/repositories/inventory.respository';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';

@Injectable()
export class MerchandiseService {
  constructor(
    private readonly merchRepo: MerchandiseRepository,
    private readonly sizeRepo: SizeRepository,
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

    await this.sizeRepo.deleteMany({
      merchandise: item._id,
    });
    await this.inventoryRepo.deleteMany({ merchandise: item._id.toString() });
    await this.merchRepo.deleteById(item._id.toString());

    return { message: 'Item deleted successfully' };
  }

  async createSize(createSizeDto: CreateSizeDto) {
    const item = await this.merchRepo.findById(createSizeDto.merchandise);
    if (!item)
      this.exceptions.badReqeustException({
        message: 'Merchandise item not found',
      });

    const newSize = await this.sizeRepo.create({
      ...createSizeDto,
      size: createSizeDto.size.toLowerCase(),
      merchandise: item._id,
    });

    const inventoryItem = await this.inventoryRepo.create({
      size: newSize.size,
      stock: 0,
      merchandise: item._id.toString(),
    });

    if (!newSize || !inventoryItem) {
      this.exceptions.internalServerException({
        message: 'Error creating size',
      });
    }

    await this.merchRepo.updateById(item._id.toString(), {
      inventory: [...item.inventory, inventoryItem._id],
    });

    return { message: `Size ${createSizeDto.size} created` };
  }
}
