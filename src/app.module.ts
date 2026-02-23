import { Module } from '@nestjs/common';
import { RabbitmqConnectionModule } from './frameworks/rabbit/rabbitmq-connection.module';
import { ProducerModule } from './patterns/work-queue/producer/producer.module';
import { ConsumerModule } from './patterns/work-queue/consumer/consumer.module';
import { PubSubModule } from './patterns/pub-sub/pub-sub.module';
import { RoutingModule } from './patterns/routing/routing.module';

@Module({
  imports: [
    RabbitmqConnectionModule,
    ProducerModule,
    ConsumerModule,
    PubSubModule,
    RoutingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
