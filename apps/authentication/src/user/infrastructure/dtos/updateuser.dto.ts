import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  mobile: string;
}
