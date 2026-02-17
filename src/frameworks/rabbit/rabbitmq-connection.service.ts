import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Channel, ChannelModel, connect } from 'amqplib';

@Injectable()
export class RabbitmqConnectionService implements OnModuleInit {
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
        this.logger.error(
          `Błąd połączenia RabbitMQ: ${err.message}`,
          err.stack,
        );
      });

      this.connection.on('close', () => {
        this.logger.warn('Połączenie RabbitMQ zostało zamknięte.');
      });

      this.logger.log('Pomyślnie połączono z RabbitMQ i utworzono kanał.');
    } catch (error) {
      if (this.connection) await this.connection.close();
      this.logger.error(
        `Nie udało się połączyć z RabbitMQ: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
