import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  count = 0;
  use(req: Request, res: Response, next: NextFunction) {
    this.count++;
    req.request_id = this.count.toString();
    let ip = req.socket.remoteAddress + "";
    ip = ip.toString().replace('::ffff:', '');
    Logger.log('http start', { url: req.url, ip: ip, http_method: req.method, referrer: req.get('Referrer') });

    res.header('RequestId', this.count.toString());
    next();
  }
}
