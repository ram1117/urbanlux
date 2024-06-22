import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { Injectable } from '@nestjs/common';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { CategoryRepository } from '@app/shared/infrastructure/repositories/category.repository';
import { FilterBrandDto } from '../infrastructure/dtos/filterbrand.dto';

@Injectable()
export class MerchandiseService {
  constructor(
    private readonly merchRepo: MerchandiseRepository,
    private readonly brandRepo: BrandRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly exceptions: ExceptionsService,
  ) {}

  async findMany(brandid: string | undefined, categoryid: string | undefined) {
    let query = {};
    if (brandid) query = { ...query, brand: brandid };
    if (categoryid) query = { ...query, category: categoryid };
    return await this.merchRepo.findManyPopulated(query);
  }

  async findFilteredBrand(id: string, filterBrandDto: FilterBrandDto) {
    let query: any = { brand: id };
    if (filterBrandDto.fromprice && filterBrandDto.toprice) {
      query = {
        ...query,
        base_price: {
          $gte: filterBrandDto.fromprice,
          $lte: filterBrandDto.toprice,
        },
      };
    }
    if (filterBrandDto.categories) {
      query = { ...query, category: { $in: filterBrandDto.categories } };
    }
    return await this.merchRepo.findManyPopulated(query);
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
}
