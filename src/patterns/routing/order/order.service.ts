import { Injectable, Logger } from '@nestjs/common';
import { RoutingService } from '../routing.service';
import {
  CancelOrderDto,
  CreateOrderDto,
  OrderShippedDto,
} from './dto/order.dto';
import {
  EVENT_TYPES,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderPaidEvent,
  OrderShippedEvent,
} from './order-event.types';
import { ROUTING_KEYS } from '../definitions/exchanges';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private routingService: RoutingService) {}

  async createOrder(dto: CreateOrderDto): Promise<string> {
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

  async cancelOrder(dto: CancelOrderDto): Promise<void> {
    const event: OrderCancelledEvent = {
      eventType: EVENT_TYPES.ORDER_CANCELLED,
      orderId: dto.orderId,
      reason: dto.reason,
      timestamp: new Date().toISOString(),
    };

    await this.routingService.publishOrderEvent(
      ROUTING_KEYS.ORDER_CANCELLED,
      event,
    );
    this.logger.log(`Order cancelled: ${event.orderId}`);
  }

  async markAsPaid(dto: PaymentDto): Promise<void> {
    const event: OrderPaidEvent = {
      eventType: EVENT_TYPES.ORDER_PAID,
      orderId: dto.orderId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      timestamp: new Date().toISOString(),
    };

    await this.routingService.publishOrderEvent(ROUTING_KEYS.ORDER_PAID, event);
    this.logger.log(`Order paid: ${dto.orderId}`);
  }

  async markAsShipped(dto: OrderShippedDto): Promise<void> {
    const event: OrderShippedEvent = {
      eventType: EVENT_TYPES.ORDER_SHIPPED,
      orderId: dto.orderId,
      trackingNumber: dto.trackingNumber,
      carrier: dto.carrier,
      timestamp: new Date().toISOString(),
    };

    await this.routingService.publishOrderEvent(
      ROUTING_KEYS.ORDER_SHIPPED,
      event,
    );

    this.logger.log(`Order shipped: ${dto.orderId}, carrier: ${dto.carrier}`);
  }
}
