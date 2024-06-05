import { Controller, Get } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';

@Controller()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Get()
  getHello(): string {
    return this.merchandiseService.getHello();
  }
}
