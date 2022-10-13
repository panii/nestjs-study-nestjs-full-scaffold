import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { environment } from '../environments/environment';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // console.log(exception)
    if (status !== HttpStatus.OK) {
      response.status(status).json({
        code: status,
        message: "oops",
        detail: environment.production ? '' : exception.getResponse(),
        timestamp: new Date().toISOString(),
        url: request.url,
        client_ip: request.ip,
      });
    }
  }
}
