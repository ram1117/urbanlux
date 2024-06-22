import { Injectable } from '@nestjs/common';
import {
  CategoryRepository,
  BrandRepository,
  InventoryRepository,
  MerchandiseRepository,
} from '@app/shared/infrastructure/repositories';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { CreateItemDto } from './infrastructure/dtos/createitem.dto';
import { UpdateInventoryDto } from './infrastructure/dtos/updateInventory.dto';
import { CreateSizeDto } from './infrastructure/dtos/createsize.dto';
import { DeleteImageDto } from './infrastructure/dtos/deleteimage.dto';
import { AddImageDto } from './infrastructure/dtos/addimage.dto';

@Injectable()
export class ItemsService {
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
    const brand = await this.brandRepo.findById(createItemDto.brand);
    const category = await this.categoryRepo.findById(createItemDto.category);

    if (!brand) {
      this.exceptions.notfoundException({ message: 'Brand not found' });
    }

    if (!category) {
      this.exceptions.notfoundException({ message: 'Category not found' });
    }

    return await this.merchRepo.create({
      ...createItemDto,
      inventory: sizeInventory,
      brand: brand._id.toString(),
      category: category._id.toString(),
      base_price: 0,
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

  async updateInventory(id: string, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepo.findById(id);
    if (!inventory)
      this.exceptions.notfoundException({
        message: 'Inventory item not found',
      });
    const item = await this.merchRepo.findById(
      updateInventoryDto.merchandiseId,
    );
    if (item.base_price === 0 || updateInventoryDto.price < item.base_price) {
      await this.merchRepo.updateById(item._id.toString(), {
        base_price: updateInventoryDto.price,
      });
    }
    return await this.inventoryRepo.updateById(inventory._id.toString(), {
      stock: inventory.stock + updateInventoryDto.stock,
      price: updateInventoryDto.price,
    });
  }

  async createSize(id: string, createSizeDto: CreateSizeDto) {
    const item = await this.merchRepo.findById(id);
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
      sizes: [...item.sizes, createSizeDto.size],
    });
  }

  async deleteMany() {
    return await this.merchRepo.deleteMany();
  }

  async addImage(id: string, addImageDto: AddImageDto) {
    const item = await this.merchRepo.findById(id);
    const newImages = [...item.images, addImageDto.image];
    let updateData: any = { images: newImages };
    if (addImageDto.thumbnail) {
      updateData = { ...updateData, thumbnail: addImageDto.thumbnail };
    }

    return await this.merchRepo.updateById(id, updateData);
  }

  async deleteImage(id: string, deleteImageDto: DeleteImageDto) {
    const item = await this.merchRepo.findById(id);
    const newImages = item.images.filter(
      (item: string) => item !== deleteImageDto.image,
    );
    return await this.merchRepo.updateById(id, { images: newImages });
  }
}
