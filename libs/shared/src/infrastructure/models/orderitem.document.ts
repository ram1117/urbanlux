import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';
import { Types } from 'mongoose';
import { MerchandiseDocument } from './merchandise.document';
import { UserDocument } from './user.document';
import { InventoryDocument } from './inventory.document';

@Schema({ timestamps: true, versionKey: false })
export class OrderItemDocument extends AbstractDocument {
  @Prop({ type: Types.ObjectId, ref: MerchandiseDocument.name })
  merchandise: string;

  @Prop()
  quantity: number;

  @Prop()
  size: string;

  @Prop()
  subtotal: number;

  @Prop()
  status: string;

  @Prop({ type: Types.ObjectId, ref: UserDocument.name })
  user: string;

  @Prop({ type: Types.ObjectId, ref: InventoryDocument.name })
  inventory: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItemDocument);
