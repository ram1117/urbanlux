import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './infrastructure/dtos/createitem.dto';
import { CreateSizeDto } from './infrastructure/dtos/createsize.dto';
import { UpdateInventoryDto } from './infrastructure/dtos/updateInventory.dto';
import { DeleteImageDto } from './infrastructure/dtos/deleteimage.dto';
import { AddImageDto } from './infrastructure/dtos/addimage.dto';
import { Roles } from '@app/shared/infrastructure/decorators/roles.decorator';
import { USER_ROLES } from '@app/shared/domain/enums';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { RolesGuard } from '@app/shared/infrastructure/guards/roles.guard';

@Roles([USER_ROLES.admin])
@UseGuards(AuthGuard, RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}

  @Get('')
  getItems() {
    return this.itemService.findMany();
  }

  @Get(':id')
  getItem(@Param('id') itemId: string) {
    return this.itemService.findById(itemId);
  }

  @Patch(':id')
  updateItem(
    @Param('id') _id: string,
    @Body() updateItemDto: Partial<CreateItemDto>,
  ) {
    return this.itemService.updateById(_id, updateItemDto);
  }

  @Post('size/:id')
  addSize(@Body() createSizeDto: CreateSizeDto, @Param('id') id: string) {
    return this.itemService.createSize(id, createSizeDto);
  }

  @Post('create')
  addItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Delete(':id')
  deleteItem(@Param('id') _id: string) {
    return this.itemService.deleteById(_id);
  }

  @Patch('inventory/:id')
  updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.itemService.updateInventory(id, updateInventoryDto);
  }

  @Patch('image/add/:id')
  addImage(@Param('id') id: string, @Body() addImageDto: AddImageDto) {
    return this.itemService.addImage(id, addImageDto);
  }

  @Patch('image/delete/:id')
  deleteImage(@Param('id') id: string, @Body() deleteImageDto: DeleteImageDto) {
    return this.itemService.deleteImage(id, deleteImageDto);
  }
}
