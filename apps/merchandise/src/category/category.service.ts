import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../infrastructure/dtos/category.repository';
import { CreateCategoryDto } from './infrastructure/dtos/createcategory.dto';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly exceptions: ExceptionsService,
  ) {}

  async findMany() {
    return await this.categoryRepo.findMany();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepo.create(createCategoryDto);
  }
}
