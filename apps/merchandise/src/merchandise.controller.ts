import { Controller, Get, Param } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';

@Controller()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Get()
  getItems() {
    return this.merchandiseService.findMany();
  }

  @Get('item/:id')
  getItem(@Param('id') itemId: string) {
    return this.merchandiseService.findById(itemId);
  }

  @Get('brand')
  getBrands() {
    return this.merchandiseService.findManyBrand();
  }

  @Get('category')
  getCategories() {
    return this.merchandiseService.findManyCategory();
  }
}
