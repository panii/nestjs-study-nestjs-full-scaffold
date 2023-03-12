import { Injectable, Inject, NestMiddleware, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { intval } from "locutus/php/var";

import { SnowFlakeV2Service } from '../services/snowflakev2.service';
import { AppService } from '../services/app.service';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  
  @Inject(SnowFlakeV2Service)
  private readonly snowFlakeV2Service: SnowFlakeV2Service;

  @Inject(AppService)
  private readonly appService: AppService;
  // constructor(private readonly snowFlakeV2Service: SnowFlakeV2Service) {}

  count = 0;
  use(req: Request, res: Response, next: NextFunction) {
    // console.log("first priority: HttpMiddleware");
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
    req.clientIP = req.get('x-real-ip') ?? ip;
    Logger.log('http start');

    res.header('X-Request-Id', req.requestID);

    if (process.env.JWT_TOKEN_ENABLE_USER === "yes") {
      const tokenkey = process.env.JWT_TOKEN_HEADER_KEY as string;

      const token = req.headers[tokenkey.toLowerCase()];
      if (token && typeof token === 'string') {
        const arr = token.split(".");
        if (arr.length === 3) {
          const userId = arr[0];
          const timestamp = arr[1];
          // const checksum = arr[2];
          
          const generatedToken = this.appService.generateToken(userId, timestamp);
          if (generatedToken === token) {
            req.userId = intval(userId);
            // req.userId = 6678;//Number(req.headers[tokenkey.toLowerCase()] ?? 0);
          }
        }
      }
      if (!req.userId) {
        throw new UnauthorizedException();
      }
    }

    next();
  }
}
