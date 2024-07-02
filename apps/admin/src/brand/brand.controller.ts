import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './infrastructure/dtos/createbrand.dto';
import { Roles } from '@app/shared/infrastructure/decorators/roles.decorator';
import { USER_ROLES } from '@app/shared/domain/enums';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { RolesGuard } from '@app/shared/infrastructure/guards/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Roles([USER_ROLES.admin])
  @Get()
  getBrands() {
    return this.brandService.findMany();
  }

  @Roles([USER_ROLES.admin])
  @Get(':id')
  getBrand(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Roles([USER_ROLES.admin])
  @Patch(':id')
  updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: Partial<CreateBrandDto>,
  ) {
    return this.brandService.updateOne(id, updateBrandDto);
  }
  @Roles([USER_ROLES.admin])
  @Post()
  addBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }
}
