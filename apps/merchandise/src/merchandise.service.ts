import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { Injectable } from '@nestjs/common';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { CategoryRepository } from '@app/shared/infrastructure/repositories/category.repository';
import { FilterItemsDto } from '../infrastructure/dtos/filteritems.dto';
import { SORT_VALUES } from '@app/shared/domain/enums';
import { InventoryRepository } from '@app/shared/infrastructure/repositories';
import { GetInventoryDto } from '../infrastructure/dtos/getinventory.dto';

@Injectable()
export class MerchandiseService {
  constructor(
    private readonly merchRepo: MerchandiseRepository,
    private readonly brandRepo: BrandRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly exceptions: ExceptionsService,
  ) {}

  async findMany(brandid: string | undefined, categoryid: string | undefined) {
    let query = {};
    if (brandid) query = { ...query, brand: brandid };
    if (categoryid) query = { ...query, category: categoryid };
    return await this.merchRepo.findManyPopulated(query);
  }

  async findFilteredBrand(filterItemsDto: FilterItemsDto) {
    let query: any = {};

    if (filterItemsDto.brandid) {
      query = { ...query, brand: filterItemsDto.brandid };
    }

    if (filterItemsDto.categoryid) {
      query = { ...query, category: filterItemsDto.categoryid };
    }

    if (filterItemsDto.fromprice && filterItemsDto.toprice) {
      query = {
        ...query,
        base_price: {
          $gte: filterItemsDto.fromprice,
          $lte: filterItemsDto.toprice,
        },
      };
    }

    if (filterItemsDto.categories) {
      query = { ...query, category: { $in: filterItemsDto.categories } };
    }

    if (filterItemsDto.brands) {
      query = { ...query, brand: { $in: filterItemsDto.brands } };
    }

    let sortby: any;
    if (filterItemsDto.sortby) {
      switch (filterItemsDto.sortby) {
        case SORT_VALUES.ALPHASC:
          sortby = { name: 1 };
          break;
        case SORT_VALUES.ALPHDSC:
          sortby = { name: -1 };
          break;
        case SORT_VALUES.PRICEASC:
          sortby = { base_price: 1 };
          break;
        case SORT_VALUES.PRICEDSC:
          sortby = { base_price: -1 };
          break;
        case SORT_VALUES.DATEDSC:
          sortby = { createdAt: -1 };
          break;
        default:
          sortby = {};
          break;
      }
    }

    return await this.merchRepo.findManyPopulated(query, sortby);
  }

  async findManyLatest() {
    return await this.merchRepo.findManyPopulatedLimit();
  }

  async findById(_id: string) {
    const item = await this.merchRepo.findOnePopulated(_id);
    if (!item)
      this.exceptions.notfoundException({
        message: 'Merchandise item not found',
      });
    return item;
  }

  async findManyBrand() {
    return await this.brandRepo.findMany({}, { name: 1 });
  }

  async findManyTopBrands() {
    return await this.brandRepo.findMany({ create_store: true });
  }

  async findManyCategory() {
    return await this.categoryRepo.findMany();
  }

  async findManyInventory(getInventoryDto: GetInventoryDto) {
    return await this.inventoryRepo.findMany({
      _id: { $in: getInventoryDto.inventory },
    });
  }
}
