import { IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateInventoryDto {
  @IsString()
  _id: string;

  @IsNumber()
  @IsPositive()
  stock: number;
}
