export const QUEUES = {
  INVENTORY: 'inventory.service.queue',
  SHIPPING: 'shipping.service.queue',
  EMAIL: 'email.service.queue',
} as const;

export const QUEUE_OPTIONS = {
  EXCLUSIVE: true,
  DURABLE: false,
  AUTO_DELETE: false,
} as const;
