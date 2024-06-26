import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './infrastructure/dtos/createcategory.dto';
import { Roles } from '@app/shared/infrastructure/decorators/roles.decorator';
import { USER_ROLES } from '@app/shared/domain/enums';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { RolesGuard } from '@app/shared/infrastructure/guards/roles.guard';

@Roles([USER_ROLES.admin])
@UseGuards(AuthGuard, RolesGuard)
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
