import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

export class MongoExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.code;

    switch (statusCode) {
      case 11000:
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          error: 'ValueNotUnique',
          message: `${Object.entries(exception.keyValue)} already exists`,
        });
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}
