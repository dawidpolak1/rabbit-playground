import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderResponse {
  @ApiProperty({
    description: 'Unique order identifier',
    example: 'ORD-1737745200000',
  })
  orderId: string;

  @ApiProperty({
    description: 'Order status',
    example: 'created',
    enum: ['created'],
  })
  status: string;
}

export class CancelOrderResponse extends CreateOrderResponse {}

export class PaidOrderResponse extends CreateOrderResponse {}
