import { Exclude, Transform } from '@nestjs/class-transformer';
import { Types } from 'mongoose';

export class NewUserEntity {
  constructor(partial: Partial<NewUserEntity>) {
    Object.assign(this, partial);
  }

  @Exclude()
  uid: string;
  @Exclude()
  role: string;

  @Transform((value) => value.obj._id.toString())
  _id: Types.ObjectId;

  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
}
