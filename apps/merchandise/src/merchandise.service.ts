import { Injectable } from '@nestjs/common';

@Injectable()
export class MerchandiseService {
  getHello(): string {
    return 'Hello World!';
  }
}
