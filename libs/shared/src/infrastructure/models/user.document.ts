import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/AbstractDocument';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  role: string;

  @Prop({ unique: true })
  mobile: string;

  @Prop({ unique: true })
  uid: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
