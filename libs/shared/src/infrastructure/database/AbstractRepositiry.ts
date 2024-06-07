import { AbstractDocument } from './AbstractDocument';
import { FilterQuery, Model } from 'mongoose';
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(private readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    return await this.model.create(document);
  }

  async findById(_id: string) {
    return await this.model.findById(_id).lean<TDocument>(true);
  }

  async findMany(
    filterQuery: FilterQuery<TDocument> = {},
    sortBy: any = {},
  ): Promise<TDocument[]> {
    return await this.model
      .find(filterQuery)
      .sort(sortBy)
      .lean<TDocument[]>(true);
  }

  async updateById(
    _id: string,
    document: Partial<TDocument>,
  ): Promise<TDocument | null> {
    return await this.model.findByIdAndUpdate(_id, document);
  }

  async deleteById(_id: string): Promise<TDocument | null> {
    return await this.model.findByIdAndDelete(_id).lean<TDocument>(true);
  }

  async deleteMany(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    return await this.model.deleteMany(filterQuery);
  }
}