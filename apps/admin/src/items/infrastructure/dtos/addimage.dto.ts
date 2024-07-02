import { IsOptional, IsString } from '@nestjs/class-validator';

export class AddImageDto {
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  thumbnail: string;
}
