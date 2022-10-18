import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  count = 0;
  use(req: Request, res: Response, next: NextFunction) {
    this.count++;
    req.request_id = this.count.toString(); // todo generate request id
    let ip = req.socket.remoteAddress + "";
    ip = ip.toString().replace('::ffff:', ''); // todo deal http forwarded
    Logger.log('http start', { url: req.url, ip: ip, http_method: req.method, referrer: req.get('Referrer') });

    res.header('X-Request-Id', this.count.toString());
    next();
  }
}
