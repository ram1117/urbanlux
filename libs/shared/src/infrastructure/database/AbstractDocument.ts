import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class AbstractDocument {
  @Transform((value) => value.obj._id.toString())
  _id: Types.ObjectId;
}
