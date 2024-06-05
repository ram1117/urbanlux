import { Module } from '@nestjs/common';
import { MerchandiseController } from './merchandise.controller';
import { MerchandiseService } from './merchandise.service';

@Module({
  imports: [],
  controllers: [MerchandiseController],
  providers: [MerchandiseService],
})
export class MerchandiseModule {}
