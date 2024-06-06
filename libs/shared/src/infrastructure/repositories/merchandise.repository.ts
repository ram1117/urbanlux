import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { InjectModel } from '@nestjs/mongoose';
import { MerchandiseDocument } from '../models/merchandise.document';
import { Model } from 'mongoose';

@Injectable()
export class MerchandiseRepository extends AbstractRepository<MerchandiseDocument> {
  constructor(
    @InjectModel(MerchandiseDocument.name)
    merchandiseModel: Model<MerchandiseDocument>,
  ) {
    super(merchandiseModel);
  }
}
