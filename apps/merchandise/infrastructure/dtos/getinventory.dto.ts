import { IsArray, IsString } from '@nestjs/class-validator';

export class GetInventoryDto {
  @IsArray()
  @IsString({ each: true })
  inventory: string[];
}
