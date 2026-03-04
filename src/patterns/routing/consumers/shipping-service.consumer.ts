import { Injectable, Logger } from '@nestjs/common';
import { RoutingService } from '../routing.service';
import { QUEUES } from '../definitions/queues';
import { ROUTING_KEYS } from '../definitions/exchanges';
import { OrderEvent, OrderPaidEvent } from '../order/order-event.types';

@Injectable()
export class ShippingServiceConsumer {
  private readonly logger = new Logger(ShippingServiceConsumer.name);

  constructor(private routingService: RoutingService) {}

  async startConsuming() {
    this.logger.log('Shipping Service consumer starting...');

    await this.routingService.subscribeToEvents(
      QUEUES.SHIPPING,
      ShippingServiceConsumer.name,
      [ROUTING_KEYS.ORDER_PAID],
      this.handleOrderPaid.bind(this),
    );
  }

  private handleOrderPaid(event: OrderEvent, routingKey: string): void {
    const paidEvent = event as OrderPaidEvent;
    this.logger.log(
      `Preparing shipment for order ${event.orderId}, paid ${paidEvent.amount} via ${paidEvent.paymentMethod}`,
    );
  }
}
