import { IsNumber, IsPositive } from 'class-validator';

export class UpdateInventoryDto {
  @IsNumber()
  stock: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
