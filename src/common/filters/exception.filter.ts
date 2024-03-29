import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost): void {

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody = {}

    if (exception.response) {
      responseBody = exception.response;
    } else if (exception.code === 11000) {
      const message = [];

      for (const key in exception.keyPattern) {
        message.push(`Please provide unique ${key}`);
      }

      responseBody = {
        statusCode: httpStatus,
        message: message,
        error: "Internal Server Error",
      }
    } else {
      responseBody = {
        statusCode: httpStatus,
        message: [
          exception.message
        ],
        "error": "Bad Request",
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}