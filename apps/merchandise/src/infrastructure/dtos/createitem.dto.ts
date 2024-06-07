import { IsArray, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  thumbnail: string;

  @IsString()
  category_code: string;

  @IsString()
  brand_code: string;

  @IsArray()
  sizes: string[];
}
