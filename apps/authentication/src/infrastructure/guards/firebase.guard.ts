import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from 'apps/authentication/src/infrastructure/config/firebase.config';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(
    private readonly admin: FirebaseAdmin,
    private readonly exceptions: ExceptionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();
    const idToken = context.getArgs()[0]?.Authentication;
    try {
      const claims = await app.auth().verifyIdToken(idToken);
      if (claims) {
        context.switchToHttp().getRequest().user = {
          role: claims.role,
          _id: claims.user_id,
          email: claims.email,
        };
        return true;
      }
    } catch (error) {
      this.exceptions.unauthorizedException({ message: error.message });
      return false;
    }

    return false;
  }
}
