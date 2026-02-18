import { Controller, Get } from '@nestjs/common';
import { ConsumerService } from './consumer.service';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get('consume')
  async consume() {
    return this.consumerService.consume();
  }
}
