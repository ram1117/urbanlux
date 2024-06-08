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
import { CreateItemDto } from './infrastructure/dtos/createitem.dto';
import { UpdateInventoryDto } from './infrastructure/dtos/updateInventory.dto';
import { CreateSizeDto } from './infrastructure/dtos/createsize.dto';

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

  @Post('item/size')
  addSize(@Body() createSizeDto: CreateSizeDto) {
    return this.merchandiseService.createSize(createSizeDto);
  }

  @Post()
  addItem(@Body() createItemDto: CreateItemDto) {
    return this.merchandiseService.create(createItemDto);
  }

  @Delete('item/:id')
  deleteItem(@Param('id') _id: string) {
    return this.merchandiseService.deleteById(_id);
  }

  @Patch('inventory')
  updateInventory(@Body() updateInventoryDto: UpdateInventoryDto) {
    return this.merchandiseService.updateInventory(updateInventoryDto);
  }
}
