import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from 'apps/authentication/src/infrastructure/config/firebase.config';
import { Reflector } from '@nestjs/core';
import { ExceptionsService } from '../exceptions/exceptions.service';

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(
    private readonly admin: FirebaseAdmin,
    private readonly exceptions: ExceptionsService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();
    const idToken = context.getArgs()[0]?.headers?.authorization;
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    try {
      const claims = await app.auth().verifyIdToken(idToken);
      console.log('$$$$$$$$$$$$$$$$$$$', claims);
      if (claims.role in roles) {
        return true;
      }
    } catch (error) {
      this.exceptions.unauthorizedException({ message: error.message });
    }

    return false;
  }
}
