import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order/order.service';
import {
  CancelOrderDto,
  CreateOrderDto,
  OrderShippedDto,
} from './order/dto/order.dto';
import {
  CancelOrderResponse,
  CreateOrderResponse,
  PaidOrderResponse,
  ShippedOrderResponse,
} from './order/response/order.response';
import { PaymentDto } from './order/dto/payment.dto';

@ApiTags('Routing - Producer')
@Controller('routing/producer')
export class RoutingProducerController {
  constructor(private orderService: OrderService) {}

  @Post('create-order')
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Creates a new order and publishes an order.created event to the routing exchange',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    type: CreateOrderResponse,
  })
  async createOrder(
    @Body() body: CreateOrderDto,
  ): Promise<CreateOrderResponse> {
    const orderId = await this.orderService.createOrder(body);
    return { orderId, status: 'created' };
  }

  @Post('cancel-order')
  @ApiOperation({
    summary: 'Cancel an order',
    description:
      'Cancels an existing order and publishes an order.cancelled event to the routing exchange',
  })
  @ApiBody({ type: CancelOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order successfully cancelled',
  })
  async cancelOrder(
    @Body() body: CancelOrderDto,
  ): Promise<CancelOrderResponse> {
    await this.orderService.cancelOrder(body);

    const orderId = body.orderId;
    return { orderId, status: 'cancelled' };
  }

  @Post('pay-order')
  @ApiOperation({
    summary: 'Mark order as paid',
    description:
      'Marks an order as paid and publishes an order.paid event to the routing exchange',
  })
  @ApiBody({ type: PaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Order successfully marked as paid',
  })
  async markAsPaid(@Body() body: PaymentDto): Promise<PaidOrderResponse> {
    await this.orderService.markAsPaid(body);

    const orderId = body.orderId;
    return { orderId, status: 'paid' };
  }

  @Post('ship-order')
  @ApiOperation({
    summary: 'Mark order as shipped',
    description:
      'Marks an order as shipped and publishes an order.shipped event to the routing exchange',
  })
  @ApiBody({ type: OrderShippedDto })
  @ApiResponse({
    status: 201,
    description: 'Order successfully marked as shipped',
  })
  async markAsShipped(
    @Body() body: OrderShippedDto,
  ): Promise<ShippedOrderResponse> {
    await this.orderService.markAsShipped(body);

    const orderId = body.orderId;
    const trackingNumber = body.trackingNumber;
    const carrier = body.carrier;

    return { orderId, trackingNumber, carrier };
  }
}
