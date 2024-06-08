import {
  IException,
  IFormatExceptionMessage,
} from '@app/shared/domain/IException';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ExceptionsService implements IException {
  notfoundException(data: IFormatExceptionMessage): void {
    throw new NotFoundException(data);
  }
  badReqeustException(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }
  internalServerException(data: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  forbiddenException(data: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
  unauthorizedException(data: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }
}
