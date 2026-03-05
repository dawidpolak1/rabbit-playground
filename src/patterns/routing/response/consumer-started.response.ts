import { ApiProperty } from '@nestjs/swagger';

export class ConsumerStartedResponse {
  @ApiProperty({
    description: 'Status message',
    example: 'consumer started',
  })
  status: string;

  @ApiProperty({
    description: 'Service name',
    example: 'inventory',
  })
  service: string;
}
