export const EXCHANGES = { ORDER_EVENTS: 'order_events' } as const;

export const EXCHANGE_TYPES = { DIRECT: 'direct' } as const;

export const ROUTING_KEYS = {
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_CANCELLED: 'order.cancelled',
} as const;
