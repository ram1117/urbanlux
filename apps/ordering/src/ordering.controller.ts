import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { CreateOrderDto } from './infrastructure/dtos/createorder.dto';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { CurrentUser } from '@app/shared/infrastructure/decorators/currentuser.decorator';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderingController {
  constructor(private readonly orderingService: OrderingService) {}

  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.orderingService.create(createOrderDto, user._id);
  }

  @Get()
  getOrders(@CurrentUser() user: any) {
    return this.orderingService.findMany(user._id);
  }

  @Get(':id')
  getOrder(@CurrentUser() user: any, @Param('id') _id: string) {
    return this.orderingService.findOne(user._id, _id);
  }

  @Patch(':id')
  cancelOrder(@Param('id') orderItemId: string) {
    return this.orderingService.updateOne(orderItemId);
  }
}
