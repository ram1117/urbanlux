import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { FilterBrandDto } from '../infrastructure/dtos/filterbrand.dto';

@Controller()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Get()
  getItems(
    @Query('brandid') brandid: string = undefined,
    @Query('categoryid') categoryid: string = undefined,
  ) {
    return this.merchandiseService.findMany(brandid, categoryid);
  }

  @Get('latest')
  getLatest() {
    return this.merchandiseService.findManyLatest();
  }

  @Get('item/:id')
  getItem(@Param('id') itemId: string) {
    return this.merchandiseService.findById(itemId);
  }

  @Get('brands')
  getBrands() {
    return this.merchandiseService.findManyBrand();
  }

  @Get('topbrands')
  getTopBrands() {
    return this.merchandiseService.findManyTopBrands();
  }

  @Get('category')
  getCategories() {
    return this.merchandiseService.findManyCategory();
  }

  @Get('brandscategories')
  async getBrandsCategories() {
    const categories = await this.merchandiseService.findManyCategory();
    const brands = await this.merchandiseService.findManyTopBrands();
    return { brands, categories };
  }

  @Post('filterbrands/:id')
  async getFilteredItems(
    @Body() filterBrandDto: FilterBrandDto,
    @Param('id') id: string,
  ) {
    return this.merchandiseService.findFilteredBrand(id, filterBrandDto);
  }
}
