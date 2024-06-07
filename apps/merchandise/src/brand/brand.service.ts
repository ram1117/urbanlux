import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './infrastructure/dtos/createbrand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepository) {}

  async findMany() {
    return await this.brandRepo.findMany();
  }

  async create(createBrandDto: CreateBrandDto) {
    return await this.brandRepo.create(createBrandDto);
  }
}
