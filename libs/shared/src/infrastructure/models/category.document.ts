import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';

@Schema({ versionKey: false })
export class CategoryDocument extends AbstractDocument {
  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ unique: true })
  category_code: string;

  @Prop()
  thumbnail: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryDocument);
