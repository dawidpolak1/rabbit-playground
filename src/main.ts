import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Swagger init
  SwaggerModule.setup(
    'rabbit-playground',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('rabbit-playground')
        .setDescription('Rabbit Playground API description')
        .setVersion('1.0')
        .build(),
    ),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger UI: http://localhost:${port}/rabbit-playground`);
  logger.log(`RabbitMQ UI: http://localhost:15672/ (guest/guest)`);
}
bootstrap();
