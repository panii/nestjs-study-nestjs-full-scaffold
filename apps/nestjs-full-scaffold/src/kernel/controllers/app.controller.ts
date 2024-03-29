import { EventPattern, Transport, ClientProxy, Payload, Ctx, MqttRecordBuilder, MqttContext, RedisContext } from '@nestjs/microservices';
import { Controller, Get, Param, Req, Res, HttpStatus, Optional, Inject, HttpException, UseInterceptors, CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Cache } from 'cache-manager';
import * as Redis from 'ioredis'; // https://github.com/luin/ioredis

import { AppService } from '../services/app.service';
import { GlobalVars } from '../global.vars';
import { DumpService } from '@app/nestjsjsondump';

@Controller()
export class AppController {
  @Inject(DumpService)
  private readonly dump: DumpService;

  constructor(
    private readonly appService: AppService, 
    @Optional() @Inject('MQTT_CLIENT') private readonly mqttClient: ClientProxy,
    @Optional() @Inject('REDIS_CLIENT') private readonly redisClient: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    ) {

    }

  // @Get('/favicon.ico')
  // favicon(@Req() req: Request, @Res() res: Response) {
  //   res.header('Content-type', 'image/png;').status(HttpStatus.OK).send(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEU0OkArMjhobHEoPUPFEBIuO0L+AAC2FBZ2JyuNICOfGx7xAwTjCAlCNTvVDA1aLzQ3COjMAAAAVUlEQVQI12NgwAaCDSA0888GCItjn0szWGBJTVoGSCjWs8TleQCQYV95evdxkFT8Kpe0PLDi5WfKd4LUsN5zS1sKFolt8bwAZrCaGqNYJAgFDEpQAAAzmxafI4vZWwAAAABJRU5ErkJggg==", "base64"));
  // }

  @Get('/env-example')
  getData(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.header('Name', AppController.name);
    res.status(HttpStatus.OK);
    return this._getData(parseInt(req.query['duration'] as string));
  }

  @Get('/prisma-example')
  getUser(@Req() req: Request) {
    return this.appService.getUser(req.query['count']);
  }

  @Get('/throw-http-exception-of-403')
  getException() {
    throw new HttpException(
      {
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN
    );
  }

  @Get('/dump-demo')
  dimpDemo() {
    this.dump.json({a: new Date().toLocaleString('sv')});
  }

  @Get('/curl-demo')
  curlDemo() {
    return this.appService.doCurl();
  }

  @Get('/env-example-use-raw-response')
  getDataPretty(@Req() req: Request, @Res() res: Response) {
    // if (!GlobalVars.pjf) GlobalVars.pjf = req;
    // console.log(GlobalVars.pjf === req)
    // console.log(GlobalVars.pjf)

    const data = this._getData2();
    res.header('Content-type', 'application/json; charset=utf-8').status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
  }

  @Get('/get-data-auto-cache-response/:id/*')
  @UseInterceptors(CacheInterceptor) // Only GET endpoints are cached. Also, HTTP server routes that inject the native response object (@Res()) cannot use the Cache Interceptor
  //@CacheKey('get-data-auto-cache-response-cache')
  @CacheTTL(20)
  async getDataAutoCache(@Param() params, @Req() req: Request) {
    const data = {
      message: new Date().toISOString(),
      id: params.id,
      a: req.query['a'] ?? 'a=null'
    }
    console.log('params.id: ' + params.id);
    console.log('query.a: ', req.query['a']);
    const firstIsNull = await this.cacheManager.get('firstIsNull');
    console.log(firstIsNull)
    console.log("do something here")

    if (this.cacheManager.store.getClient) {
      const redisStore = this.cacheManager.store.getClient() as Redis; // https://github.com/luin/ioredis
      const bbbaaa = await redisStore.get('aaa');
      console.log(bbbaaa);

      redisStore.mset({ k1: "v1", k2: "v2" });

      const mGetResult = await redisStore.mget(['k1', 'k2', 'k3']);
      console.log(mGetResult)
    }

    return data;
  }

  @Get('/benchmark/hello-world')
  benchmarkHelloWorld() {
    return { hello: 'world' };
  }

  @Get('/publish-mqtt-message')
  publishMqttMessage() {
    const userProperties = { 'x-version': '1.0.0' }; // protocolVersion: 5 , only mqtt 5 support extra properties
    const record = new MqttRecordBuilder('hahaha, this is a mqtt message').setProperties({ userProperties }).setQoS(2).build();
    
    if (this.configService.get<string>('MQTT_PUBLISH_CLIENT_ENABLE') === 'yes') {
      this.mqttClient.emit('mqtt_event_1', record);
    }

    return { 
      'MQTT_PUBLISH_CLIENT_ENABLE': this.configService.get<string>('MQTT_PUBLISH_CLIENT_ENABLE'), 
      hello: record
    };
  }
  
  @Get('/publish-redis-message')
  publishRedisMessage() {
    if (this.configService.get<string>('REDIS_PUBLISH_CLIENT_ENABLE') === 'yes') {
      this.redisClient.emit('redis_event_1', 'hahaha, this is a redis pubsub message');
    }

    return { 
      'REDIS_PUBLISH_CLIENT_ENABLE': this.configService.get<string>('REDIS_PUBLISH_CLIENT_ENABLE')
    };
  }

  @EventPattern('redis_event_1', Transport.REDIS) // subscribe redis_event
  async redisEvent1(@Payload() data: string, @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`);
    console.log(data);
  }

  @EventPattern('mqtt_event_1', Transport.MQTT) // subscribe mqtt_event
  async mqttEvent1(@Payload() data: string, @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
    console.log(`Packet: ${context.getPacket()} ==> `);
    console.log(context.getPacket());
    console.log(data);
    // const { properties: { userProperties } } = context.getPacket(); // protocolVersion: 5 , only mqtt 5 support extra properties
    // console.log(`x-version: ${userProperties['x-version']}`);
  }

  _getData2() {
    return this.appService.getData();
  }

  async _getData(duration: number) {
    await this.timeout(duration);
    return this.appService.getData();
  }
  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @Get('/_profiler/req/res')
  async profilerReqRes(@Req() req: Request, @Res() res: Response) {
    const dateStr = req.query['date'] as string || new Date().toLocaleDateString('sv');
    const data = await this.appService.getLoggedRequestLists(dateStr)

    res.header('Content-type', 'application/json; charset=utf-8').status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
  }
}
