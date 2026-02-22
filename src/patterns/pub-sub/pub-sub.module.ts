import { Module } from '@nestjs/common';
import { RabbitmqConnectionModule } from '../../frameworks/rabbit/rabbitmq-connection.module';
import { PubSubService } from './pub-sub.service';
import { PubSubController } from './pub-sub.controller';

@Module({
  imports: [RabbitmqConnectionModule],
  controllers: [PubSubController],
  providers: [PubSubService],
})
export class PubSubModule {}
