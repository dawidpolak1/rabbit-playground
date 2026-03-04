import { Module } from '@nestjs/common';
import { OrderService } from './order/order.service';
import { RabbitmqConnectionModule } from '../../frameworks/rabbit/rabbitmq-connection.module';
import { RoutingService } from './routing.service';
import { RoutingProducerController } from './routing-producer.controller';

@Module({
  imports: [RabbitmqConnectionModule],
  controllers: [RoutingProducerController],
  providers: [RoutingService, OrderService],
})
export class RoutingProducerModule {}
