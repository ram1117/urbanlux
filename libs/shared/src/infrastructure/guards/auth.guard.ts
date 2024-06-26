import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { SERVICE_NAMES, SERVICE_PATTERNS } from '@app/shared/domain/enums';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly exceptions: ExceptionsService,
    @Inject(SERVICE_NAMES.AUTH) private authService: ClientProxy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenId = request.headers.authorization;

    if (!tokenId)
      this.exceptions.unauthorizedException({ message: 'Please login' });

    return this.authService
      .send({ cmd: SERVICE_PATTERNS.AUTH }, { Authentication: tokenId })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
