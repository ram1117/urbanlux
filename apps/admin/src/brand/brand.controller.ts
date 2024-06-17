import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './infrastructure/dtos/createbrand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  getBrands() {
    return this.brandService.findMany();
  }

  @Get(':id')
  getBrand(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: Partial<CreateBrandDto>,
  ) {
    return this.brandService.updateOne(id, updateBrandDto);
  }

  @Post()
  addBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }
}
