import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './infrastructure/dtos/createsize.dto';
import { UpdateInventoryDto } from './infrastructure/dtos/updateInventory.dto';
import { CreateItemDto } from './infrastructure/dtos/createitem.dto';
import {
  CategoryRepository,
  BrandRepository,
  InventoryRepository,
  MerchandiseRepository,
} from '@app/shared/infrastructure/repositories';

@Injectable()
export class AdminService {
  constructor(
    private readonly merchRepo: MerchandiseRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly brandRepo: BrandRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly exceptions: ExceptionsService,
  ) {}
  async findMany() {
    return await this.merchRepo.findMany();
  }

  async create(createItemDto: CreateItemDto) {
    const sizeInventory = await Promise.all(
      createItemDto.sizes.map(async (size: string) => {
        const item = await this.inventoryRepo.create({
          size: size.toLowerCase(),
          stock: 0,
          price: 0,
        });
        return item._id;
      }),
    );
    const brand = await this.brandRepo.findById(createItemDto.brand_id);
    const category = await this.categoryRepo.findById(
      createItemDto.category_id,
    );

    if (!brand) {
      this.exceptions.notfoundException({ message: 'Brand not found' });
    }

    return await this.merchRepo.create({
      ...createItemDto,
      inventory: sizeInventory,
      brand: brand._id.toString(),
      brand_code: brand.brand_code,
      category: category._id.toString(),
      category_code: category.category_code,
    });
  }

  async findById(_id: string) {
    const item = await this.merchRepo.findOnePopulated(_id);
    if (!item)
      this.exceptions.notfoundException({
        message: 'Merchandise item not found',
      });
    return item;
  }

  async updateById(_id: string, updateItemDto: Partial<CreateItemDto>) {
    const item = await this.merchRepo.updateById(_id, updateItemDto);
    if (!item)
      this.exceptions.notfoundException({
        message: 'Merchandise item not found',
      });
    return item;
  }

  async deleteById(_id: string) {
    const item = await this.merchRepo.findById(_id);
    if (!item)
      this.exceptions.notfoundException({
        message: 'Merchandise item not found',
      });

    await this.inventoryRepo.deleteMany({ merchandise: item._id.toString() });
    await this.merchRepo.deleteById(item._id.toString());

    return { message: 'Item deleted successfully' };
  }

  async updateInventory(updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepo.findById(updateInventoryDto._id);
    if (!inventory)
      this.exceptions.notfoundException({
        message: 'Inventory item not found',
      });
    return await this.inventoryRepo.updateById(inventory._id.toString(), {
      stock: inventory.stock + updateInventoryDto.stock,
      price: updateInventoryDto.price,
    });
  }

  async createSize(createSizeDto: CreateSizeDto) {
    const item = await this.merchRepo.findById(createSizeDto._id);
    if (!item) {
      this.exceptions.notfoundException({
        message: 'Merchandise item not found',
      });
    }

    const newSize = await this.inventoryRepo.create({
      size: createSizeDto.size,
      stock: 0,
      price: 0,
    });

    return await this.merchRepo.updateById(item._id.toString(), {
      inventory: [...item.inventory, newSize._id],
    });
  }

  async deleteMany() {
    return await this.merchRepo.deleteMany();
  }
}
