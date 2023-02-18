import { ModuleRef } from "@nestjs/core";
import { Injectable, Scope, Inject, LoggerService, Logger, OnModuleInit, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RequestContext } from "nestjs-request-context";

import { GlobalVars } from "../../../kernel/global.vars";
import { environment } from "../../../environments/environment";
import { sprintf } from "locutus/php/strings";
import { PrismaService } from "../../../kernel/services/prisma.service";
import { CurlService } from "../../../kernel/services/curl.service";
import * as qs from 'qs';

@Injectable({
  scope: Scope.DEFAULT,
})
export class ApiService implements OnModuleInit {
  private prismaService: PrismaService;
  private curlService: CurlService;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.prismaService = this.moduleRef.get(PrismaService, { strict: false });
    this.curlService = this.moduleRef.get(CurlService, { strict: false });
  }

  
}
