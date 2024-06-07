import { Body, Controller, Get, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './infrastructure/dtos/createbrand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  getBrands() {
    return this.brandService.findMany();
  }

  @Post()
  addBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }
}
