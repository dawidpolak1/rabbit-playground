import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqConnectionService } from '../frameworks/rabbit/rabbitmq-connection.service';
import { QUEUES } from '../frameworks/rabbit/queues';

@Injectable()
export class ProducerService implements OnModuleInit {
  private readonly logger = new Logger(ProducerService.name);

  constructor(
    private readonly rabbitConnectionService: RabbitmqConnectionService,
  ) {}

  async onModuleInit() {
    const channel = this.rabbitConnectionService.getChannel();
    await channel.assertQueue(QUEUES.TASK, { durable: true });
  }

  async send(message: object) {
    const channel = this.rabbitConnectionService.getChannel();
    channel.sendToQueue(QUEUES.TASK, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    this.logger.log(`Sent to the queue: ${message}`);
  }
}
