import { Controller, Get, Param, Query } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';

@Controller()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Get()
  getItems(@Query('brandcode') brandcode: string = '') {
    return this.merchandiseService.findMany(brandcode);
  }

  @Get('item/:id')
  getItem(@Param('id') itemId: string) {
    return this.merchandiseService.findById(itemId);
  }

  @Get('brand')
  getBrands() {
    return this.merchandiseService.findManyBrand();
  }

  @Get('brandstore')
  getTopBrands() {
    return this.merchandiseService.findManyBrandStore();
  }

  @Get('category')
  getCategories() {
    return this.merchandiseService.findManyCategory();
  }
}
