import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqConnectionService } from '../../../frameworks/rabbit/rabbitmq-connection.service';
import { QUEUES } from '../../../frameworks/rabbit/queues';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly rabbitConnectionService: RabbitmqConnectionService,
  ) {}

  async onModuleInit() {
    const channel = this.rabbitConnectionService.getChannel();
    await channel.assertQueue(QUEUES.TASK, { durable: true });
    this.logger.log(` [*] Waiting for messages in ${QUEUES.TASK}.`);
  }

  async consume() {
    const channel = this.rabbitConnectionService.getChannel();
    await channel.prefetch(1);
    await channel.consume(QUEUES.TASK, (msg) => {
      if (!msg) {
        this.logger.warn('Received null message (consumer cancelled)');
        return;
      }

      const content = msg.content.toString();
      const seconds = content.split('.').length - 1;

      this.logger.log(`[x] Received ${msg?.content.toString()}`);

      setTimeout(() => {
        this.logger.log('[x] Done');
        channel.ack(msg); // Ack AFTER work completes
      }, seconds * 1000);
    });
  }
}
