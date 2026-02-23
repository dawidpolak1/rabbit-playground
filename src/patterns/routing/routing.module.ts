import { Module } from '@nestjs/common';
import { OrderService } from './order/order.service';
import { RabbitmqConnectionModule } from '../../frameworks/rabbit/rabbitmq-connection.module';
import { RoutingService } from './routing.service';
import { RoutingController } from './routing.controller';

@Module({
  imports: [RabbitmqConnectionModule],
  controllers: [RoutingController],
  providers: [RoutingService, OrderService],
})
export class RoutingModule {}
