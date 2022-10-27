import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Request, Response } from 'express';
import { environment } from '../../environments/environment';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly eventEmitter: EventEmitter2){}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.eventEmitter.emit('kernel.HttpException', ctx);
    // console.log(exception)
    if (status !== HttpStatus.OK) {
      Logger.error(`http end ${status}`, exception.stack);
      
      response.status(status).json({
        code: status,
        message: 'oops',
        detail: environment.production ? '' : exception.getResponse(),
        iso_date: new Date().toISOString(),
        url: request.url,
        client_ip: request.clientIP
      });
    }
  }
}
