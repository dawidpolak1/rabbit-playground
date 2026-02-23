import { RabbitmqConnectionService } from '../../frameworks/rabbit/rabbitmq-connection.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EXCHANGES, EXCHANGE_TYPES } from './definitions/exchanges';
import { OrderEvent } from './order/order-event.types';

@Injectable()
export class RoutingService implements OnModuleInit {
  private readonly logger = new Logger(RoutingService.name);

  constructor(private rabbitConnectionService: RabbitmqConnectionService) {}

  async onModuleInit(): Promise<any> {
    const channel = this.rabbitConnectionService.getChannel();
    await channel.assertExchange(
      EXCHANGES.ORDER_EVENTS,
      EXCHANGE_TYPES.DIRECT,
      {
        durable: true,
      },
    );

    this.logger.log(`Exchange '${EXCHANGES.ORDER_EVENTS}' asserted`);
  }

  async publishOrderEvent(
    routingKey: string,
    event: OrderEvent,
  ): Promise<void> {
    const channel = this.rabbitConnectionService.getChannel();
    const message = JSON.stringify(event);

    channel.publish(EXCHANGES.ORDER_EVENTS, routingKey, Buffer.from(message), {
      persistent: true,
    });

    this.logger.log(`Published ${routingKey}: ${event.orderId}`);
  }

  async subscribeToEvents(
    queueName: string,
    consumerName: string,
    routingKeys: string[],
    handler: (event: OrderEvent, routingKey: string) => void,
  ): Promise<void> {
    const channel = this.rabbitConnectionService.getChannel();

    // Create temporary named exclusive queue for this consumer
    const q = await channel.assertQueue(queueName, {
      exclusive: true,
      durable: false,
      autoDelete: false,
    });
    this.logger.log(`[${consumerName}] Created queue: ${q.queue}`);

    for (const key of routingKeys) {
      await channel.bindQueue(q.queue, EXCHANGES.ORDER_EVENTS, key);
      this.logger.log(`[${consumerName}] Bound to routing key: ${key}`);
    }

    await channel.consume(q.queue, (msg) => {
      if (msg) {
        const event: OrderEvent = JSON.parse(msg.content.toString());
        this.logger.log(
          `[${consumerName}] Received ${msg.fields.routingKey}: ${event.orderId}`,
        );
        handler(event, msg.fields.routingKey);
      }
    });
  }
}
