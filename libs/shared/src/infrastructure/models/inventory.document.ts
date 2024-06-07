import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';

@Schema({ versionKey: false, timestamps: true })
export class InventoryDocument extends AbstractDocument {
  @Prop()
  size: string;

  @Prop()
  stock: number;

  @Prop()
  merchandise: string;
}

export const InventorySchema = SchemaFactory.createForClass(InventoryDocument);
