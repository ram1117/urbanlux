import { Controller, Get } from '@nestjs/common';
import { OrderingService } from './ordering.service';

@Controller()
export class OrderingController {
  constructor(private readonly orderingService: OrderingService) {}

  @Get()
  getHello(): string {
    return this.orderingService.getHello();
  }
}
