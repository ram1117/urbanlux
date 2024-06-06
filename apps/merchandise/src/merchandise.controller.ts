import { Controller, Get } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';

@Controller()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Get()
  getItems() {
    return this.merchandiseService.findMany();
  }
}
