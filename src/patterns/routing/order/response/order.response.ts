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

export class ShippedOrderResponse {
  @ApiProperty({
    description: 'Unique order identifier',
    example: 'ORD-1737745200000',
  })
  orderId: string;

  @ApiProperty({
    description: 'Tracking number for the shipment',
    example: 'TRACK-789XYZ',
  })
  trackingNumber: string;

  @ApiProperty({
    description: 'Carrier of the order',
    example: 'dhl',
  })
  carrier: 'dhl' | 'fedex' | 'ups';
}
