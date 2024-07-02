import { BrandRepository } from '@app/shared/infrastructure/repositories/brand.repository';
import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './infrastructure/dtos/createbrand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepository) {}

  async findMany() {
    return await this.brandRepo.findMany();
  }

  async findOne(id: string) {
    return await this.brandRepo.findById(id);
  }

  async updateOne(id: string, updateBrandDto: Partial<CreateBrandDto>) {
    return await this.brandRepo.updateById(id, updateBrandDto);
  }

  async create(createBrandDto: CreateBrandDto) {
    return await this.brandRepo.create(createBrandDto);
  }

  async deleteMany() {
    return await this.brandRepo.deleteMany();
  }
}
