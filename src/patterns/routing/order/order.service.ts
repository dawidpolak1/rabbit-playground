import { Injectable, Logger } from '@nestjs/common';
import { RoutingService } from '../routing.service';
import { CreateOrder } from './order.dto';
import { EVENT_TYPES, OrderCreatedEvent } from './order-event.types';
import { ROUTING_KEYS } from '../definitions/exchanges';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private routingService: RoutingService) {}

  async createOrder(dto: CreateOrder): Promise<string> {
    const orderId = `ORD-${Date.now()}`;

    const event: OrderCreatedEvent = {
      eventType: EVENT_TYPES.ORDER_CREATED,
      orderId,
      items: dto.items,
      total: dto.total,
      timestamp: new Date().toISOString(),
    };

    await this.routingService.publishOrderEvent(
      ROUTING_KEYS.ORDER_CREATED,
      event,
    );
    this.logger.log(`Order created: ${orderId}`);

    return orderId;
  }
}
