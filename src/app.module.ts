import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqConnectionModule } from './frameworks/rabbit/rabbitmq-connection.module';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [RabbitmqConnectionModule, ProducerModule, ConsumerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
