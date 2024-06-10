import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';
import { Types } from 'mongoose';
import { UserDocument } from './user.document';

@Schema({ timestamps: true, versionKey: false })
export class AddressDocumet extends AbstractDocument {
  @Prop()
  label: string;

  @Prop()
  line1: string;

  @Prop()
  line2: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  postal_code: string;

  @Prop()
  country: string;

  @Prop({ type: Types.ObjectId, ref: UserDocument.name })
  user: string;
}

export const AddressSchema = SchemaFactory.createForClass(AddressDocumet);
