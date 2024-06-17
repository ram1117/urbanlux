import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';

@Schema({ versionKey: false, timestamps: true })
export class BrandDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  brand_code: string;

  @Prop()
  logo: string;

  @Prop()
  create_store: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(BrandDocument);
