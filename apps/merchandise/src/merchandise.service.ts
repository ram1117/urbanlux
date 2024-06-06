import { MerchandiseRepository } from '@app/shared/infrastructure/repositories/merchandise.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MerchandiseService {
  constructor(private readonly merchRepo: MerchandiseRepository) {}

  async findMany() {
    return await this.merchRepo.findMany();
  }
}
