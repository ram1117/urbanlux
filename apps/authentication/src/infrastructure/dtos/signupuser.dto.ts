import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignupUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsStrongPassword()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  mobile: string;
}
