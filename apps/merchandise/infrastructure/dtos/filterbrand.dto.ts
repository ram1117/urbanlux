import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class FilterBrandDto {
  @IsOptional()
  @IsNumber()
  fromprice: number;

  @IsOptional()
  @IsNumber()
  toprice: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
