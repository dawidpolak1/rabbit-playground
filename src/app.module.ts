import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqConnectionModule } from './frameworks/rabbit/rabbitmq-connection.module';

@Module({
  imports: [RabbitmqConnectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
