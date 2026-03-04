import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({
    description: 'Order ID to mark as paid',
    example: 'ORD-1234567890',
  })
  orderId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 99.99,
    minimum: 0,
  })
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    example: 'credit_card',
  })
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}
