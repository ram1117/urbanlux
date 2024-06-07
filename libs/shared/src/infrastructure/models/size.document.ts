import { AbstractDocument } from '@app/shared/infrastructure/database/AbstractDocument';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MerchandiseDocument } from './merchandise.document';

@Schema({ timestamps: true, versionKey: false })
export class SizeDocument extends AbstractDocument {
  @Prop({ unique: true })
  size: string;

  @Prop({ type: Types.ObjectId, ref: MerchandiseDocument.name })
  merchandise: Types.ObjectId;
}

export const SizeDocumentSchema = SchemaFactory.createForClass(SizeDocument);
