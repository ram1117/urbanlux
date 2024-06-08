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

  async findMany() {
    return await this.merchRepo.findMany();
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
    return await this.brandRepo.findMany();
  }

  async findManyCategory() {
    return await this.categoryRepo.findMany();
  }
}
