import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException, Logger } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, tap } from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  static HTTP_TIMEOUT: number;

  constructor(http_timeout: number) {
    HttpInterceptor.HTTP_TIMEOUT = http_timeout;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // console.log('Before...');
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    if (request.url.startsWith('/benchmark')) {
      return next.handle();
    }

    const now = Date.now();
    // const { statusCode } = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap((
        // data
        ) => {
        // console.log({
        //   statusCode,
        //   data,
        // });
        // console.log(`After... ${Date.now() - now}ms`);
        Logger.log('http responsed ok', {'duration': Date.now() - now});
      }),
      timeout(HttpInterceptor.HTTP_TIMEOUT), // http timeout set to X
      catchError((err) => {
        if (err instanceof TimeoutError) {
          Logger.error('http responsed timeout', {'duration': Date.now() - now});
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => {
          Logger.error('http responsed exception', err.stack, {'duration': Date.now() - now});
          return err;
        });
      })
    );
  }
}
