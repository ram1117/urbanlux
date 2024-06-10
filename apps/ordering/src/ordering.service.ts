import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderingService {
  getHello(): string {
    return 'Hello World!';
  }
}
