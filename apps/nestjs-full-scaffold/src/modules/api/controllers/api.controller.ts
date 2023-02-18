import { EventPattern, Transport, ClientProxy, Payload, Ctx, MqttRecordBuilder, MqttContext, RedisContext } from '@nestjs/microservices';
import { Controller, Get, Post, Put, Delete, Req, Res, HttpStatus, Optional, Inject, HttpException, UseInterceptors, CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL, Param, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Cache } from 'cache-manager';
import * as Redis from 'ioredis'; // https://github.com/luin/ioredis

import { GlobalVars } from '../../../kernel/global.vars';
import { environment } from '../../../environments/environment';
import { ApiService } from '../services/api.service';
import { DumpService } from '@app/nestjsjsondump';

@Controller()
export class ApiController {
  @Inject(DumpService)
  private readonly dump: DumpService;

  @Inject(ApiService)
  private readonly apiService: ApiService;

  
}
