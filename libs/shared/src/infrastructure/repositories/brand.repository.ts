import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { BrandDocument } from '../models/brand.document';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandRepository extends AbstractRepository<BrandDocument> {
  constructor(
    @InjectModel(BrandDocument.name) brandModel: Model<BrandDocument>,
  ) {
    super(brandModel);
  }
}
