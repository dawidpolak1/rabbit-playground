import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'PROD-123',
  })
  productId: string;

  @ApiProperty({
    description: 'Quantity of items',
    example: 2,
    minimum: 1,
  })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'List of items in the order',
    type: [OrderItemDto],
    example: [
      { productId: 'PROD-001', quantity: 2 },
      { productId: 'PROD-002', quantity: 1 },
    ],
  })
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Total order amount',
    example: 99.99,
    minimum: 0,
  })
  total: number;
}

export class CancelOrderDto {
  @ApiProperty({
    description: 'Order ID to cancel',
    example: 'ORD-1234567890',
  })
  orderId: string;

  @ApiProperty({
    description: 'Reason for cancellation',
    example: 'customer_request',
  })
  reason: string;
}

export class OrderShippedDto {
  @ApiProperty({
    description: 'Order ID to mark as shipped',
    example: 'ORD-1234567890',
  })
  orderId: string;

  @ApiProperty({
    description: 'Tracking number for the shipment',
    example: 'TRACK-789XYZ',
  })
  trackingNumber: string;

  @ApiProperty({
    description: 'Shipping carrier',
    enum: ['dhl', 'fedex'],
    example: 'dhl',
  })
  carrier: 'dhl' | 'fedex';
}
