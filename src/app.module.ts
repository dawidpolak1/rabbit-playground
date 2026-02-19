import { Module } from '@nestjs/common';
import { RabbitmqConnectionModule } from './frameworks/rabbit/rabbitmq-connection.module';
import { ProducerModule } from './patterns/work-queue/producer/producer.module';
import { ConsumerModule } from './patterns/work-queue/consumer/consumer.module';

@Module({
  imports: [RabbitmqConnectionModule, ProducerModule, ConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
