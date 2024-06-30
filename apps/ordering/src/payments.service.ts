import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  SERVICE_NAMES,
  SERVICE_PATTERNS,
} from '@app/shared/domain/enums';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { AddressDocumet } from '@app/shared/infrastructure/models';
import {
  OrderRepository,
  PaymentRepository,
} from '@app/shared/infrastructure/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripeClient = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    { apiVersion: '2024-04-10' },
  );

  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly orderRepo: OrderRepository,
    private readonly configService: ConfigService,
    private readonly exceptions: ExceptionsService,
    @Inject(SERVICE_NAMES.AUTH) private notificationService: ClientProxy,
  ) {}

  async createIntent(userid: string, total: number, address: AddressDocumet) {
    const payment_intent = await this.stripeClient.paymentIntents.create({
      description: userid,
      shipping: {
        name: address.fullname,
        address: {
          line1: address.line1,
          line2: address.line2,
          postal_code: address.postal_code,
          state: address.state,
          country: address.country,
          city: address.city,
        },
      },
      amount: total * 100,
      currency: 'usd',
      confirm: true,
      payment_method: 'pm_card_visa',
      setup_future_usage: 'off_session',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    if (!payment_intent) {
      this.exceptions.internalServerException({
        message: 'Unable to create payment intent',
      });
    }

    return payment_intent.id;
  }

  async findSecret(orderid: string) {
    const orderpayment = await this.paymentRepo.findOne({ order_id: orderid });
    if (!orderpayment)
      this.exceptions.notfoundException({
        message: 'Payment details not found',
      });
    const intent_id = orderpayment.payment_intent;
    const order = await this.orderRepo.findById(orderid);
    const intent = await this.stripeClient.paymentIntents.retrieve(intent_id);
    return { secret: intent.client_secret, order };
  }

  async updatePaymentStatus(payment_intent: string, user: any) {
    const order_id = (await this.paymentRepo.findOne({ payment_intent }))
      .order_id;
    await this.orderRepo.updateById(order_id, {
      payment_status: PAYMENT_STATUS.COMPLETE,
    });

    this.notificationService.emit(
      { cmd: SERVICE_PATTERNS.NOTIFYADMIN },
      {
        username: user.name,
        email: user.email,
        orderid: order_id,
        order_status: ORDER_STATUS.PLACED,
      },
    );

    return { message: 'payment updated.' };
  }

  async createRefund(order_id: string, user: any, refundamount: number = 0) {
    const payment = await this.paymentRepo.findOne({ order_id });
    const order = await this.orderRepo.findOne({
      _id: order_id,
      user: user._id,
    });
    const refundValue = refundamount > 0 ? refundamount : order.total;

    const { id } = await this.stripeClient.refunds.create({
      payment_intent: payment.payment_intent,
      reason: 'requested_by_customer',
      amount: refundValue,
    });

    await this.paymentRepo.updateById(payment._id.toString(), {
      refund_id: id,
    });
    const udpatedorder = await this.orderRepo.updateById(payment.order_id, {
      cancelled: true,
      payment_status:
        refundValue === order.total
          ? PAYMENT_STATUS.REFUNDCOMPLETE
          : PAYMENT_STATUS.REFUNDPARTIAL,
      order_status: ORDER_STATUS.CANCELLED,
      total: order.total - refundValue,
    });
    this.notificationService.emit(
      { cmd: SERVICE_PATTERNS.NOTIFYUSER },
      {
        username: user.name,
        email: user.email,
        orderid: order_id,
        order_status: ORDER_STATUS.CANCELLED,
      },
    );
    return udpatedorder;
  }

  async handleHookEvent(signature: string, payload: Buffer) {
    const hookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    const event = this.stripeClient.webhooks.constructEvent(
      payload,
      signature,
      hookSecret,
    );
    if (!event) {
      this.exceptions.internalServerException({
        message: 'Error constructing event from webhook',
      });
    }

    if (event.type === 'payment_intent.succeeded') {
      const data = event.data.object as Stripe.PaymentIntent;
      const { id, status } = data;
      if (status === 'succeeded') {
        const order_id = (
          await this.paymentRepo.findOne({ payment_intent: id })
        ).order_id;
        await this.orderRepo.updateById(order_id, {
          payment_status: PAYMENT_STATUS.COMPLETE,
        });
      }
    }
    return true;
  }
}
