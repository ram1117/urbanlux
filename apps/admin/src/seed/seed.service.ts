import { Injectable, OnModuleInit } from '@nestjs/common';
// import { BrandService } from '../../../admin/src/brand/brand.service';
// import { CategoryService } from '../../../admin/src/category/category.service';
// import {
//   DataCategories,
//   DataBrands,
//   DataMerchandise,
// } from './data/seeder.data';
// import { LoggerService } from '@app/shared/infrastructure/logger/logger.service';
// import { AdminService } from '../admin.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor() {} // private readonly logger: LoggerService, // private readonly adminService: AdminService, // private readonly categoryService: CategoryService, // private readonly brandService: BrandService,

  async onModuleInit() {
    // const hasCategories = (await this.categoryService.findMany()).length > 0;
    // const hasBrands = (await this.brandService.findMany()).length > 0;
    // if (!hasCategories && !hasBrands) {
    //   this.logger.log('', 'Seeding Data.');
    //   const categories = await Promise.all(
    //     DataCategories.map((item) => this.categoryService.create(item)),
    //   );
    //   const brands = await Promise.all(
    //     DataBrands.map((item) => this.brandService.create(item)),
    //   );
    //   const merchandise = await Promise.all(
    //     DataMerchandise.map((item) => this.adminService.create(item)),
    //   );
    //   this.logger.log(`Seeded ${categories.length} Categories`, '');
    //   this.logger.log(`Seeded ${brands.length} Brands`, '');
    //   this.logger.log(`Seeded ${merchandise.length} Merchandise`, '');
    // }
  }
}
