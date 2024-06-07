import { AbstractRepository } from '@app/shared/infrastructure/database/AbstractRepositiry';
import { CategoryDocument } from '@app/shared/infrastructure/models/category.document';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
  constructor(
    @InjectModel(CategoryDocument.name)
    readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }
}
