/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder().setTitle('Booking API').setVersion('0.1').addBearerAuth({
    type: 'http',
    name: 'Authorization',
    in: 'header',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 Swagger is running on: http://localhost:${port}/docs`);
  Logger.log(`🚀 Monitor is running on: http://localhost:${port}/${globalPrefix}/status`);
}

bootstrap();
