import { Type } from '@nestjs/class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from '@nestjs/class-validator';

class OrderItemsDto {
  @IsString()
  merchandise: string;

  @IsString()
  inventory: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsDto)
  items: OrderItemsDto[];

  @IsString()
  delivery_address: string;

  @IsString()
  billing_address: string;
}
