import { Module } from '@nestjs/common';
import { RabbitmqConnectionService } from './rabbitmq-connection.service';

@Module({
  providers: [
    RabbitmqConnectionService,
    {
      provide: 'RABBITMQ_URL',
      useValue: 'amqp://guest:guest@localhost:5672',
    },
  ],
  exports: [RabbitmqConnectionService],
})
export class RabbitmqConnectionModule {}
