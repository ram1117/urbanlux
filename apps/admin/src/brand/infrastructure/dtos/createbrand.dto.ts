import { IsBoolean } from '@nestjs/class-validator';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  brand_code: string;

  @IsString()
  logo: string;

  @IsBoolean()
  create_store: boolean;
}
