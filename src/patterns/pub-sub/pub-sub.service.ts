import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqConnectionService } from '../../frameworks/rabbit/rabbitmq-connection.service';
import { EXCHANGE_TYPES, EXCHANGES } from './exchanges';

@Injectable()
export class PubSubService implements OnModuleInit {
  private readonly logger = new Logger(PubSubService.name);

  constructor(
    private readonly rabbitConnectionService: RabbitmqConnectionService,
  ) {}

  async onModuleInit(): Promise<any> {
    const channel = this.rabbitConnectionService.getChannel();
    await channel.assertExchange(EXCHANGES.LOGS, EXCHANGE_TYPES.FANOUT, {
      durable: false,
    });

    this.logger.log(`Exchange '${EXCHANGES.LOGS}' asserted`);
  }

  async emit(message: object): Promise<void> {
    const channel = this.rabbitConnectionService.getChannel();
    channel.publish(EXCHANGES.LOGS, '', Buffer.from(JSON.stringify(message)));

    this.logger.log(`[X] Sent to the exchange: ${JSON.stringify(message)}`);
  }

  async subscribe(): Promise<void> {
    const channel = this.rabbitConnectionService.getChannel();

    const temporaryQueue = await channel.assertQueue('', {
      exclusive: true,
    });
    this.logger.log(`Created temp queue: ${temporaryQueue.queue}`);

    await channel.bindQueue(temporaryQueue.queue, EXCHANGES.LOGS, '');
    this.logger.log(
      `Bound ${temporaryQueue.queue} to exchange '${EXCHANGES.LOGS}'`,
    );

    await channel.consume(
      temporaryQueue.queue,
      (msg) => {
        if (msg) {
          this.logger.log(`Received: ${msg.content.toString()}`);
        }
      },
      { noAck: true },
    );
  }
}
