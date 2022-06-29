import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerDocumentOptions } from './swagger/swaggerDocumentOptions';
import { FastifySwaggerCustomOptions } from './swagger/fastifySwaggerCustomOptions';
import { contentParser } from 'fastify-multer';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('port');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  console.log('port', port);

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
  await app.register(contentParser);

  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
