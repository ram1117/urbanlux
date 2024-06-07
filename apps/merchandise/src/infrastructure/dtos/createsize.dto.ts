import { IsString } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  _id: string;
  @IsString()
  size: string;
}
