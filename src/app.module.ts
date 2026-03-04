import { Module } from '@nestjs/common';
import { RabbitmqConnectionModule } from './frameworks/rabbit/rabbitmq-connection.module';
import { ConsumerModule } from './patterns/work-queue/consumer/consumer.module';
import { PubSubModule } from './patterns/pub-sub/pub-sub.module';
import { RoutingProducerModule } from './patterns/routing/routing-producer.module';
import { RoutingConsumerModule } from './patterns/routing/routing-consumer.module';

@Module({
  imports: [
    RabbitmqConnectionModule,
    ConsumerModule,
    PubSubModule,
    RoutingProducerModule,
    RoutingConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
