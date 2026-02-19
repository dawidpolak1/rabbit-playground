import { Body, Controller, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('send')
  async send(@Body() message: object) {
    return this.producerService.send(message);
  }
}
