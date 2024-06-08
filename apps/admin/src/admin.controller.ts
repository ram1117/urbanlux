import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateItemDto } from './infrastructure/dtos/createitem.dto';
import { CreateSizeDto } from './infrastructure/dtos/createsize.dto';
import { UpdateInventoryDto } from './infrastructure/dtos/updateInventory.dto';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('item')
  getItems() {
    return this.adminService.findMany();
  }

  @Get('item/:id')
  getItem(@Param('id') itemId: string) {
    return this.adminService.findById(itemId);
  }

  @Patch('item/:id')
  updateItem(
    @Param('id') _id: string,
    @Body() updateItemDto: Partial<CreateItemDto>,
  ) {
    return this.adminService.updateById(_id, updateItemDto);
  }

  @Post('item/size')
  addSize(@Body() createSizeDto: CreateSizeDto) {
    return this.adminService.createSize(createSizeDto);
  }

  @Post('item/create')
  addItem(@Body() createItemDto: CreateItemDto) {
    return this.adminService.create(createItemDto);
  }

  @Delete('item/:id')
  deleteItem(@Param('id') _id: string) {
    return this.adminService.deleteById(_id);
  }

  @Patch('item/inventory')
  updateInventory(@Body() updateInventoryDto: UpdateInventoryDto) {
    return this.adminService.updateInventory(updateInventoryDto);
  }
}
