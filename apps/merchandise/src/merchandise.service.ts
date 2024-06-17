import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { Injectable } from '@nestjs/common';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { CategoryRepository } from '@app/shared/infrastructure/repositories/category.repository';

@Injectable()
export class MerchandiseService {
  constructor(
    private readonly merchRepo: MerchandiseRepository,
    private readonly brandRepo: BrandRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly exceptions: ExceptionsService,
  ) {}

  async findMany(brandcode: string = '', categorycode = '') {
    let query = {};
    if (brandcode.length > 0) query = { ...query, brand_code: brandcode };
    if (categorycode.length > 0)
      query = { ...query, category_code: categorycode };
    return await this.merchRepo.findManyPopulated(query);
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

  async findManyBrandStore() {
    return await this.brandRepo.findMany({ create_store: true });
  }

  async findManyCategory() {
    return await this.categoryRepo.findMany();
  }
}
