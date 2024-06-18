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
  brand: string;

  @IsString()
  category: string;

  @IsArray()
  sizes: string[];
}
