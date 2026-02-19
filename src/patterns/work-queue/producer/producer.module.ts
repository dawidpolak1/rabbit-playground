import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { RabbitmqConnectionModule } from '../../../frameworks/rabbit/rabbitmq-connection.module';

@Module({
  controllers: [ProducerController],
  providers: [ProducerService],
  imports: [RabbitmqConnectionModule],
})
export class ProducerModule {}
