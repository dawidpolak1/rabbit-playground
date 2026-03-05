import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Channel, ChannelModel, connect } from 'amqplib';

@Injectable()
export class RabbitmqConnectionService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitmqConnectionService.name);

  private connection: ChannelModel;
  private channel: Channel;

  constructor(@Inject('RABBITMQ_URL') private rabbitUrl: string) {}

  async onModuleInit() {
    let conn: ChannelModel;
    try {
      this.logger.log(`Łączenie z RabbitMQ pod adresem: ${this.rabbitUrl} ...`);
      conn = await connect(this.rabbitUrl);
      this.channel = await conn.createChannel();
      this.connection = conn;

      this.connection.on('error', (err) => {
        const message = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : undefined;
        this.logger.error(`Błąd połączenia RabbitMQ: ${message}`, stack);
      });

      this.connection.on('close', () => {
        this.logger.warn('Połączenie RabbitMQ zostało zamknięte.');
      });

      this.logger.log('Pomyślnie połączono z RabbitMQ i utworzono kanał.');
    } catch (error) {
      if (this.connection) await this.connection.close();
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Nie udało się połączyć z RabbitMQ: ${message}`, stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
        this.logger.log('RabbitMQ channel closed.');
      }
      if (this.connection) {
        await this.connection.close();
        this.logger.log('RabbitMQ connection closed.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Error closing RabbitMQ connection:', message);
    }
  }

  public getChannel(): Channel {
    return this.channel;
  }
}
