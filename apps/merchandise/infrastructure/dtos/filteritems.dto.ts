import { SORT_VALUES } from '@app/shared/domain/enums';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class FilterItemsDto {
  @IsOptional()
  @IsString()
  brandid: string;

  @IsOptional()
  @IsString()
  categoryid: string;

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brands: string[];

  @IsOptional()
  @IsString()
  sortby: SORT_VALUES;
}
