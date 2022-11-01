import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';
import { environment } from '../../environments/environment';
import { GlobalVars } from '../global.vars';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (req.url.startsWith(`/${GlobalVars.appName}/benchmark`) || req.url.startsWith(`/${GlobalVars.appName}/_profiler`)) {
      return;
    }
    
    if (exception instanceof NotFoundException) {
      // void
    } else {
      this.eventEmitter.emit('kernel.HttpException', { req: req, body: { res: exception.getResponse(), stack: exception.stack }, res: res });
    }
    
    // console.log(exception)
    if (status !== HttpStatus.OK) {
      Logger.error(`http end ${status}`, exception.stack);

      res.status(status).json({
        code: status,
        message: 'oops',
        detail: environment.production ? '' : exception.getResponse(),
        iso_date: new Date().toISOString(),
        url: req.url,
        client_ip: req.clientIP,
      });
    }
  }
}
