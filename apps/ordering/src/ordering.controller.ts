import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { CreateOrderDto } from './infrastructure/dtos/createorder.dto';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { CurrentUser } from '@app/shared/infrastructure/decorators/currentuser.decorator';
import { PaymentsService } from './payments.service';
import RequestWithRawBody from '@app/shared/domain/IRawBody';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderingController {
  constructor(
    private readonly orderingService: OrderingService,
    private readonly paymentService: PaymentsService,
    private readonly exceptions: ExceptionsService,
  ) {}

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

  @Patch('cancel/:id')
  cancelOrder(@Param('id') orderid: string, @CurrentUser() user: any) {
    return this.paymentService.createRefund(orderid, user);
  }

  @Get('payment/:id')
  getPaymentSecret(@Param('id') orderid: string) {
    return this.paymentService.findSecret(orderid);
  }

  @Post('payment/:id')
  updatePaymentStatus(@Param('id') intentid: string, @CurrentUser() user: any) {
    return this.paymentService.updatePaymentStatus(intentid, user);
  }

  @Post('payment/webhook')
  async handleHook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature) {
      this.exceptions.internalServerException({
        message: 'Missing stripe signature header',
      });
    }
    const success = await this.paymentService.handleHookEvent(
      signature,
      request.rawBody,
    );
    if (success) return { status: HttpStatus.OK };
  }
}
