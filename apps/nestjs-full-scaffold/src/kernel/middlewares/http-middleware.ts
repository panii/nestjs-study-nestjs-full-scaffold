import { Injectable, Inject, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { SnowFlakeV2Service } from '../services/snowflakev2.service';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  
  @Inject(SnowFlakeV2Service)
  private readonly snowFlakeV2Service: SnowFlakeV2Service;
  // constructor(private readonly snowFlakeV2Service: SnowFlakeV2Service) {}

  count = 0;
  use(req: Request, res: Response, next: NextFunction) {
    console.log("first priority: HttpMiddleware");
    this.count++;
    req.requestID = this.snowFlakeV2Service.gen.NextId().toString();

    // let id1: number | bigint;
    // for (let i = 0; i < 1000; i++) {
    //   id1 = this.snowFlakeV2Service.gen.NextId();
    //   console.log(`${i} ID:${id1} 长度：${id1.toString().length}`);
    // }

    req.startTime = Date.now();
    let ip = req.socket.remoteAddress + '';
    ip = ip.toString().replace('::ffff:', ''); // todo deal http forwarded
    req.clientIP = ip;
    Logger.log('http start');

    res.header('X-Request-Id', req.requestID);
    next();
  }
}
