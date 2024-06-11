import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';
import { Types } from 'mongoose';
import { OrderDocument } from './order.document';

@Schema()
export class PaymentDocument extends AbstractDocument {
  @Prop({ type: Types.ObjectId, ref: OrderDocument.name })
  order_id: string;

  @Prop()
  payment_intent: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
