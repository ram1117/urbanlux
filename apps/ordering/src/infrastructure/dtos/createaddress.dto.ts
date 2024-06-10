import { IsPostalCode, IsString } from '@nestjs/class-validator';

export class CreateAddressDto {
  @IsString()
  label: string;

  @IsString()
  line1: string;

  @IsString()
  line2: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsPostalCode('any')
  postal_code: string;

  @IsString()
  country: string;
}
