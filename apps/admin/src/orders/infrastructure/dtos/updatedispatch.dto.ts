import { IsString, MinLength } from '@nestjs/class-validator';

export class UpdateDispatchDto {
  @IsString()
  @MinLength(6)
  tracking_id: string;
}
