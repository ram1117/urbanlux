import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { RolesGuard } from '@app/shared/infrastructure/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from '@app/shared/infrastructure/decorators/roles.decorator';
import { USER_ROLES } from '@app/shared/domain/enums';
import { FilterOrderDto } from './infrastructure/dtos/filterorder.dto';
import { UpdateDispatchDto } from './infrastructure/dtos/updatedispatch.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles([USER_ROLES.admin])
  @Get()
  getOrdersByStatus(@Query('order_status') order_status: string) {
    if (order_status === 'all') {
      return this.ordersService.findMany({});
    }
    return this.ordersService.findMany({
      order_status: order_status,
    });
  }

  @Roles([USER_ROLES.admin])
  @Patch('confirm/:id')
  confirmOrder(@Param('id') orderid: string) {
    return this.ordersService.updateOrderStatus(orderid);
  }

  @Roles([USER_ROLES.admin])
  @Patch('dispatch/:id')
  createDispatch(
    @Param('id') orderid: string,
    @Body() updateDispatchDto: UpdateDispatchDto,
  ) {
    return this.ordersService.updateDispatch(orderid, updateDispatchDto);
  }

  @Roles([USER_ROLES.admin])
  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles([USER_ROLES.admin])
  @Post()
  async getFilteredOrders(
    @Query('order_status') order_status: string,
    @Body() filterOrderDto: FilterOrderDto,
  ) {
    if (order_status === 'all') {
      return this.ordersService.findManyFilter({}, filterOrderDto);
    }

    return this.ordersService.findManyFilter(
      {
        order_status: order_status,
      },
      filterOrderDto,
    );
  }
}
