import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConsumerService } from './consumer.service';

@ApiTags('Work Queue - Consumer')
@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get('consume')
  async consume() {
    return this.consumerService.consume();
  }
}
