import { IsUrl } from '@nestjs/class-validator';

export class DeleteImageDto {
  @IsUrl()
  image: string;
}
