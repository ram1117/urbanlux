import { USER_ROLES } from '@app/shared/domain/constants';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  role: USER_ROLES;

  @IsString()
  mobile: string;

  @IsString()
  uid: string;
}
