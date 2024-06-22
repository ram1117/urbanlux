import { IsString } from '@nestjs/class-validator';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateInventoryDto {
  @IsNumber()
  stock: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  merchandiseId: string;
}
