import { Injectable, Scope } from '@nestjs/common';
import { OnEvent } from "@nestjs/event-emitter";
import { Request, Response } from 'express';
import * as Redis from 'ioredis'; // https://github.com/luin/ioredis

import { GlobalVars } from '../global.vars';
import { SsdbService } from '../services/ssdb.service';
import { sprintf } from 'locutus/php/strings';

interface HttpObject {
  req: Request;
  res: Response;
  body: unknown;
}

@Injectable({
    scope: Scope.DEFAULT // Event subscribers cannot be request-scoped.
})
export class HttpResponseService {
  public static KEY_OF_REQ = `%s:LOG-REQ:%s`;

  ssdbStore: Redis;
  
  constructor(private readonly ssdbService: SsdbService) {
    if (process.env.SSDB_LOG_REQ_RES_ENABLE === 'yes') {
      this.ssdbStore = this.ssdbService.ssdbStore;
    } else {
      this.ssdbStore = null;
    }
  }

  // @OnEvent('kernel.*')
  @OnEvent('kernel.HttpException', { async: true, nextTick: true })
  async handleHttpExceptionEvent(httpOpject: HttpObject) {
    // handle and process an event
    //response.header('Event-subscriber', 'kernel.HttpException');
    if (this.ssdbStore) {
      await this.ssdbStore.hset(`${GlobalVars.appName}:LOG-RES:${new Date().toLocaleDateString('sv')}`, `response-${httpOpject.req.requestID}`, httpOpject.res.statusCode + '-' + JSON.stringify(httpOpject.body));
    }
    // console.log("Do error push notify when HttpException occured, statusCode: " + httpOpject.res.statusCode)
  }

  @OnEvent('kernel.Responsed', { async: true, nextTick: true }) // this will not trigger if the controller use the raw express response send function
  async handleHttpResponsedEvent(httpOpject: HttpObject) {
    // handle and process an event
    if (this.ssdbStore) {
      const code = httpOpject.res.statusCode;
      await this.ssdbStore.hset(`${GlobalVars.appName}:LOG-RES:${new Date().toLocaleDateString('sv')}`, `response-${httpOpject.req.requestID}`, code + '-' + JSON.stringify(httpOpject.body));
      // hmset
    } else {
      // console.log("Do log response when end response, body: ", httpOpject.body);
    }
  }
  
  @OnEvent('kernel.GotRequest')
  async handleGotRequestEvent(req: Request) {
    // handle and process an event
    if (this.ssdbStore) {
      await this.ssdbStore.lpush(sprintf(HttpResponseService.KEY_OF_REQ, GlobalVars.appName, new Date().toLocaleDateString('sv')), req.requestID + "-" + JSON.stringify({time: new Date().toLocaleString('sv'), url: req.url, ip: req.clientIP, header: req.headers}));
    } else {
      // console.log("Do log request when got request: ", {url: req.url, ip: req.clientIP});
    }
  }
}
