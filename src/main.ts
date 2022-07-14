import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fmp from 'fastify-multipart';
import { AppModule } from './app.module';
import { SwaggerDocumentOptions } from './swagger/swaggerDocumentOptions';
import { FastifySwaggerCustomOptions } from './swagger/fastifySwaggerCustomOptions';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('port');

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Scott-Point example')
    .setDescription('Scott Point API')
    .setVersion('1.0')
    .addTag('scott-point')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: FastifySwaggerCustomOptions = {
    uiConfig: {},
  };

  SwaggerModule.setup('docs', app, document, customOptions);

  app.register(fmp);

  app.enableCors();

  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
