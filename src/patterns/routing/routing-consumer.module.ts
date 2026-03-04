import { Module } from '@nestjs/common';
import { RoutingConsumerController } from './routing-consumer.controller';
import { RoutingService } from './routing.service';
import { InventoryServiceConsumer } from './consumers/inventory-service.consumer';
import { ShippingServiceConsumer } from './consumers/shipping-service.consumer';
import { RabbitmqConnectionModule } from '../../frameworks/rabbit/rabbitmq-connection.module';

@Module({
  imports: [RabbitmqConnectionModule],
  controllers: [RoutingConsumerController],
  providers: [
    RoutingService,
    InventoryServiceConsumer,
    ShippingServiceConsumer,
  ],
})
export class RoutingConsumerModule {}
