import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { CreateItemDto } from './infrastructure/dtos/merchandise.dto';
import { CreateSizeDto } from './infrastructure/dtos/size.dto';

@Controller()
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Get()
  getItems() {
    return this.merchandiseService.findMany();
  }

  @Get('item/:id')
  getItem(@Param('id') itemId: string) {
    return this.merchandiseService.findById(itemId);
  }

  @Patch('item/:id')
  updateItem(
    @Param('id') _id: string,
    @Body() updateItemDto: Partial<CreateItemDto>,
  ) {
    return this.merchandiseService.updateById(_id, updateItemDto);
  }

  @Post()
  addItem(@Body() createItemDto: CreateItemDto) {
    return this.merchandiseService.create(createItemDto);
  }

  @Post('addsize')
  addSize(@Body() createSizeDto: CreateSizeDto) {
    return this.merchandiseService.createSize(createSizeDto);
  }

  @Delete('item/:id')
  deleteItem(@Param('id') _id: string) {
    return this.merchandiseService.deleteById(_id);
  }
}
