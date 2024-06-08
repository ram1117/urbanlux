import { Injectable, OnModuleInit } from '@nestjs/common';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { MerchandiseService } from '../merchandise.service';
import {
  DataCategories,
  DataBrands,
  DataMerchandise,
} from './data/seeder.data';
import { LoggerService } from '@app/shared/infrastructure/logger/logger.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly merchandiseService: MerchandiseService,
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit() {
    const hasCategories = (await this.categoryService.findMany()).length > 0;
    const hasBrands = (await this.brandService.findMany()).length > 0;
    if (!hasCategories && !hasBrands) {
      this.logger.log('', 'Seeding Data.');
      const categories = await Promise.all(
        DataCategories.map((item) => this.categoryService.create(item)),
      );
      const brands = await Promise.all(
        DataBrands.map((item) => this.brandService.create(item)),
      );
      const merchandise = await Promise.all(
        DataMerchandise.map((item) => this.merchandiseService.create(item)),
      );
      this.logger.log(`Seeded ${categories.length} Categories`, '');
      this.logger.log(`Seeded ${brands.length} Brands`, '');
      this.logger.log(`Seeded ${merchandise.length} Merchandise`, '');
    }
  }
}
