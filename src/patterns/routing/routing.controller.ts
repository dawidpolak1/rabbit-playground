import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order/order.service';
import type { CreateOrder } from './order/order.dto';

@Controller('routing')
export class RoutingController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: CreateOrder) {
    const orderId = await this.orderService.createOrder(body);
    return { orderId, status: 'created' };
  }
}
