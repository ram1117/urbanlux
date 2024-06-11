import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { PaymentDocument } from '../models/payment.document';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentRepository extends AbstractRepository<PaymentDocument> {
  constructor(
    @InjectModel(PaymentDocument.name) paymentModel: Model<PaymentDocument>,
  ) {
    super(paymentModel);
  }
}
