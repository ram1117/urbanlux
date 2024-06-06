import { AbstractDocument } from '@app/shared/infrastructure/database/AbstractDocument';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
class Size {
  @Prop()
  size: string;

  @Prop()
  price: number;

  @Prop()
  stock: number;
}

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
  sizes: Size[];

  @Prop()
  category_code: string;

  @Prop()
  brand_code: string;
}

export const MerchandiseSchema =
  SchemaFactory.createForClass(MerchandiseDocument);
