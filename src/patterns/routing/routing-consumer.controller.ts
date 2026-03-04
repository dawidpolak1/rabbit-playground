import { InventoryServiceConsumer } from './consumers/inventory-service.consumer';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShippingServiceConsumer } from './consumers/shipping-service.consumer';
import { EmailServiceConsumer } from './consumers/email-service.consumer';
import { ConsumerStartedResponse } from './consumers/consumer-started.response';

@ApiTags('routing/consumer')
@Controller('routing/consumer')
export class RoutingConsumerController {
  constructor(
    private inventoryService: InventoryServiceConsumer,
    private shippingServiceConsumer: ShippingServiceConsumer,
    private emailServiceConsumer: EmailServiceConsumer,
  ) {}

  @Post('/inventory/start')
  @ApiOperation({
    summary: 'Start inventory service consumer',
    description:
      'Starts the consumer that listens for order events on the inventory routing key',
  })
  @ApiResponse({
    status: 200,
    description: 'Consumer started successfully',
    type: ConsumerStartedResponse,
  })
  async startInventoryConsumer(): Promise<ConsumerStartedResponse> {
    await this.inventoryService.startConsuming();
    return { status: 'consumer started', service: 'inventory' };
  }

  @Post('/shipping/start')
  @ApiOperation({
    summary: 'Start shipping service consumer',
    description: 'Starts the consumer that listens for order events on the ',
  })
  @ApiResponse({
    status: 200,
    description: 'Consumer started successfully',
    type: ConsumerStartedResponse,
  })
  async startShippingConsumer(): Promise<ConsumerStartedResponse> {
    await this.shippingServiceConsumer.startConsuming();
    return { status: 'consumer started', service: 'shipping' };
  }

  @Post('/email/start')
  @ApiOperation({
    summary: 'Start email service consumer',
    description: 'Starts the consumer that listens for order events on the ',
  })
  async startEmailConsumer(): Promise<ConsumerStartedResponse> {
    await this.emailServiceConsumer.startConsuming();
    return { status: 'consumer started', service: 'email' };
  }
}
