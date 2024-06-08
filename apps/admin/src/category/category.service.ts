import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@app/shared/infrastructure/repositories/category.repository';
import { CreateCategoryDto } from './infrastructure/dtos/createcategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async findMany() {
    return await this.categoryRepo.findMany();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepo.create(createCategoryDto);
  }

  async deleteMany() {
    return await this.categoryRepo.deleteMany();
  }
}
