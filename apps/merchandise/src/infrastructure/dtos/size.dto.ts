import { IsString } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  size: string;

  @IsString()
  merchandise: string;
}
