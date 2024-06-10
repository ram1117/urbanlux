import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { SignupUserDto } from './infrastructure/dtos/signupuser.dto';
import { USER_ROLES } from '@app/shared/domain/enums';
import { FirebaseAdmin } from './infrastructure/config/firebase.config';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseAdmin: FirebaseAdmin,
    private readonly exceptions: ExceptionsService,
  ) {}
  async create(signupUserDto: SignupUserDto) {
    try {
      const app = this.firebaseAdmin.setup();
      const newUser = await app.auth().createUser({
        email: signupUserDto.email,
        password: signupUserDto.password,
        displayName: `${signupUserDto.firstname} ${signupUserDto.lastname}`,
      });

      await app
        .auth()
        .setCustomUserClaims(newUser.uid, { role: USER_ROLES.user });

      return this.userService.create({
        ...signupUserDto,
        role: USER_ROLES.user,
        uid: newUser.uid,
      });
    } catch (error) {
      this.exceptions.badReqeustException({ message: error.message });
    }
  }
}
