import { ORDER_STATUS } from '@app/shared/domain/enums';
import { IsString } from '@nestjs/class-validator';

export class PayloadDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  orderid: string;

  @IsString()
  order_status: ORDER_STATUS;
}
