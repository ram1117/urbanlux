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
      await app.auth().createUser({
        email: signupUserDto.email,
        password: signupUserDto.password,
        displayName: `${signupUserDto.firstname} ${signupUserDto.lastname}`,
      });

      const user = await this.userService.create({
        ...signupUserDto,
        role: USER_ROLES.user,
      });

      return user;
    } catch (error) {
      this.exceptions.badReqeustException({ message: error.message });
    }
  }

  async authenticate(idToken: string) {
    const app = this.firebaseAdmin.setup();
    try {
      const claims = await app.auth().verifyIdToken(idToken);
      if (claims) {
        const user = await this.userService.find({ email: claims.email });
        return {
          _id: user._id,
          email: claims.email,
          role: user.role,
          name: user.firstname,
        };
      }
    } catch (error) {
      this.exceptions.unauthorizedException({ message: error.message });
      return null;
    }
  }
}
