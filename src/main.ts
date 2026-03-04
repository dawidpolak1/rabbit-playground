import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
