import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProducerService } from './producer.service';

@ApiTags('Work Queue - Producer')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('send')
  async send(@Body() message: object) {
    return this.producerService.send(message);
  }
}
