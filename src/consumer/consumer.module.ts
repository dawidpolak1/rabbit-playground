import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { RabbitmqConnectionModule } from '../frameworks/rabbit/rabbitmq-connection.module';

@Module({
  controllers: [ConsumerController],
  providers: [ConsumerService],
  imports: [RabbitmqConnectionModule],
})
export class ConsumerModule {}
