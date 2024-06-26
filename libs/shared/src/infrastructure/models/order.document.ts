import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';
import { Types } from 'mongoose';
import { OrderItemDocument } from './orderitem.document';
import { AddressDocumet } from './address.document';
import { UserDocument } from './user.document';

@Schema({ versionKey: false, timestamps: true })
export class OrderDocument extends AbstractDocument {
  @Prop({ type: Types.ObjectId, ref: OrderItemDocument.name })
  items: OrderItemDocument[];

  @Prop()
  total: number;

  @Prop({ type: Types.ObjectId, ref: AddressDocumet.name })
  address: AddressDocumet;

  @Prop()
  payment_status: string;

  @Prop()
  order_status: string;

  @Prop({ type: Types.ObjectId, ref: UserDocument.name })
  user: string;

  @Prop()
  cancelled: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
