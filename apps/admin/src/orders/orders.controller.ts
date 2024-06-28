import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { RolesGuard } from '@app/shared/infrastructure/guards/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from '@app/shared/infrastructure/decorators/roles.decorator';
import { ORDER_STATUS, USER_ROLES } from '@app/shared/domain/enums';

@UseGuards(AuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles([USER_ROLES.admin])
  @Get('placed')
  getPlacedOrders() {
    return this.ordersService.findMany({ order_status: ORDER_STATUS.PLACED });
  }
}
