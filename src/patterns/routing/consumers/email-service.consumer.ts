import { Injectable, Logger } from '@nestjs/common';
import { RoutingService } from '../routing.service';
import { ROUTING_KEYS } from '../definitions/exchanges';
import { QUEUES } from '../definitions/queues';
import { OrderEvent, OrderShippedEvent } from '../order/order-event.types';

@Injectable()
export class EmailServiceConsumer {
  private readonly logger = new Logger(EmailServiceConsumer.name);
  constructor(private routingService: RoutingService) {}

  async startConsuming() {
    this.logger.log('Email Service consumer starting...');

    await this.routingService.subscribeToEvents(
      QUEUES.EMAIL,
      EmailServiceConsumer.name,
      [ROUTING_KEYS.ORDER_SHIPPED],
      this.handleOrderShipped.bind(this),
    );
  }

  private handleOrderShipped(event: OrderEvent, routingKey: string): void {
    const shippedEvent = event as OrderShippedEvent;
    this.logger.log(
      `Sending shipping email for order ${event.orderId}, tracking: ${shippedEvent.trackingNumber} via ${shippedEvent.carrier}`,
    );
  }
}
