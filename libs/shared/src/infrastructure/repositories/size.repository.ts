import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { SizeDocument } from '../models/size.document';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SizeRepository extends AbstractRepository<SizeDocument> {
  constructor(
    @InjectModel(SizeDocument.name) readonly sizeModel: Model<SizeDocument>,
  ) {
    super(sizeModel);
  }
}
