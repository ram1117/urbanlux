import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';

@Schema({ versionKey: false, timestamps: true })
export class InventoryDocument extends AbstractDocument {
  @Prop({ unique: true })
  size: string;

  @Prop()
  stock: number;

  @Prop()
  price: number;
}

export const InventorySchema = SchemaFactory.createForClass(InventoryDocument);
