import { AbstractDocument } from '@app/shared/infrastructure/database/AbstractDocument';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { InventoryDocument } from './inventory.document';
import { BrandDocument } from './brand.document';

@Schema({ timestamps: true, versionKey: false })
export class MerchandiseDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  features: string[];

  @Prop()
  thumbnail: string;

  @Prop()
  images: string[];

  @Prop()
  category_code: string;

  @Prop()
  brand_code: string;

  @Prop({ type: Types.ObjectId, ref: BrandDocument.name })
  brand: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: InventoryDocument.name })
  inventory: Types.ObjectId[];
}

export const MerchandiseSchema =
  SchemaFactory.createForClass(MerchandiseDocument);
