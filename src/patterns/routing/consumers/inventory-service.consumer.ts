import { Injectable, Logger } from '@nestjs/common';
import { RoutingService } from '../routing.service';
import { QUEUES } from '../definitions/queues';
import { ROUTING_KEYS } from '../definitions/exchanges';
import { OrderEvent } from '../order/order-event.types';

@Injectable()
export class InventoryServiceConsumer {
  private readonly logger = new Logger(InventoryServiceConsumer.name);

  constructor(private routingService: RoutingService) {}

  async startConsuming(): Promise<void> {
    this.logger.log('Inventory Service consumer starting...');

    await this.routingService.subscribeToEvents(
      QUEUES.INVENTORY,
      InventoryServiceConsumer.name,
      [ROUTING_KEYS.ORDER_CREATED, ROUTING_KEYS.ORDER_CANCELLED],
      this.handleOrderEvent.bind(this),
    );
  }

  private handleOrderEvent(event: OrderEvent, routingKey: string): void {
    if (routingKey === ROUTING_KEYS.ORDER_CREATED) {
      this.logger.log(`Reserving stock for order ${event.orderId}`);
    } else if (routingKey === ROUTING_KEYS.ORDER_CANCELLED) {
      this.logger.log(`Releasing stock for cancelled order ${event.orderId}`);
    }
  }
}
