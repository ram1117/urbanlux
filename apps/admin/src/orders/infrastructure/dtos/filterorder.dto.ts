import { IsOptional, IsString } from '@nestjs/class-validator';

export class FilterOrderDto {
  @IsOptional()
  @IsString()
  order_id: string;

  @IsOptional()
  @IsString()
  user_email: string;

  @IsOptional()
  @IsString()
  user_name: string;

  @IsOptional()
  @IsString()
  order_date: string;
}
