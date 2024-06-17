import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './infrastructure/dtos/createcategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.findMany();
  }

  @Get(':id')
  getCategory(@Param('id') _id: string) {
    return this.categoryService.findById(_id);
  }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  updateCategory(
    @Body() updateCategortDto: Partial<CreateCategoryDto>,
    @Param('id') id: string,
  ) {
    return this.categoryService.updateById(id, updateCategortDto);
  }
}
