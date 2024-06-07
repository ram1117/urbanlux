import { AbstractDocument } from '@app/shared/infrastructure/database/AbstractDocument';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class SizePropertyDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  description: string;
}

@Schema({ timestamps: true, versionKey: false })
export class SizeDocument extends AbstractDocument {
  @Prop({ unique: true })
  size: string;

  @Prop({ type: [SizePropertyDocument] })
  properties: Types.Array<SizePropertyDocument>;
}

export const SizePropertySchema =
  SchemaFactory.createForClass(SizePropertyDocument);
export const SizeDocumentSchema = SchemaFactory.createForClass(SizeDocument);
