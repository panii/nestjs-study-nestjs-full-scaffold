import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';

import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, tap } from 'rxjs/operators';
import { GlobalVars } from '../global.vars';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  static HTTP_TIMEOUT: number;

  constructor(http_timeout: number, private readonly eventEmitter: EventEmitter2) {
    HttpInterceptor.HTTP_TIMEOUT = http_timeout;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    if (req.url.startsWith(`/${GlobalVars.appName}/benchmark`) || req.url.startsWith(`/${GlobalVars.appName}/_profiler`)) {
      return next.handle();
    }
    console.log("second priority: HttpInterceptor");
    this.eventEmitter.emit('kernel.GotRequest', req);
    return next.handle().pipe(
      tap((str) => {
        this.eventEmitter.emit('kernel.Responsed', { req: req, body: str, res: res });
        Logger.log('http end 200');
      }),
      timeout(HttpInterceptor.HTTP_TIMEOUT), // http timeout set to X
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => {
          return err;
        });
      })
    );
  }
}
