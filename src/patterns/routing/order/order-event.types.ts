export interface BaseOrderEvent {
  orderId: string;
  timestamp: string;
  eventType: EventType;
}

export const EVENT_TYPES = {
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_CANCELLED: 'order.cancelled',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface OrderCreatedEvent extends BaseOrderEvent {
  eventType: typeof EVENT_TYPES.ORDER_CREATED;
  items: Array<{ productId: string; quantity: number }>;
  total: number;
}

export interface OrderPaidEvent extends BaseOrderEvent {
  eventType: typeof EVENT_TYPES.ORDER_PAID;
  amount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}

export interface OrderShippedEvent extends BaseOrderEvent {
  eventType: typeof EVENT_TYPES.ORDER_SHIPPED;
  trackingNumber: string;
  carrier: 'dhl' | 'fedex' | 'ups';
}

export interface OrderCancelledEvent extends BaseOrderEvent {
  eventType: typeof EVENT_TYPES.ORDER_CANCELLED;
  reason: string;
}

export type OrderEvent =
  | OrderCreatedEvent
  | OrderPaidEvent
  | OrderShippedEvent
  | OrderCancelledEvent;
