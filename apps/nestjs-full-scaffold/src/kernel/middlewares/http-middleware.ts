import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  count = 0;
  use(req: Request, res: Response, next: NextFunction) {
    // console.log("first priority: HttpMiddleware");
    this.count++;
    req.requestID = this.count.toString(); // todo generate request id
    req.startTime = Date.now();
    let ip = req.socket.remoteAddress + "";
    ip = ip.toString().replace('::ffff:', ''); // todo deal http forwarded
    req.clientIP = ip;
    Logger.log('http start');

    res.header('X-Request-Id', req.requestID);
    next();
  }
}
