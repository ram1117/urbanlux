import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from '@app/shared/infrastructure/guards/auth.guard';
import { CurrentUser } from '@app/shared/infrastructure/decorators/currentuser.decorator';
import { CreateAddressDto } from './infrastructure/dtos/createaddress.dto';

@UseGuards(AuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  getAddresses(@CurrentUser() user: any) {
    return this.addressService.findMany(user._id);
  }

  @Get(':id')
  getAddress(@Param('id') _id: string) {
    return this.addressService.findOne(_id);
  }

  @Post()
  addAddress(
    @CurrentUser() user: any,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(user._id, createAddressDto);
  }
}
