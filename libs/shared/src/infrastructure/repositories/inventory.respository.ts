import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../database/AbstractRepositiry';
import { InventoryDocument } from '../models/inventory.document';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InventoryRepository extends AbstractRepository<InventoryDocument> {
  constructor(
    @InjectModel(InventoryDocument.name)
    readonly modelInventory: Model<InventoryDocument>,
  ) {
    super(modelInventory);
  }
}
