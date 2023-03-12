import { Injectable, Scope, Inject, LoggerService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestContext } from 'nestjs-request-context';
// import { Logger } from 'winston';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { GlobalVars } from '../global.vars';
import { ApiGetterService } from './api.getter.service';
import { CurlService } from './curl.service';
import { SsdbService } from './ssdb.service';
import { PrismaService } from './prisma.service';
import { environment } from '../../environments/environment';
import { HttpResponseService } from '../events/http.response.service';
import { sprintf } from 'locutus/php/strings';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as crypto from "crypto"

interface anObject {
  str: string;
  num: number;
}

@Injectable({
  scope: Scope.DEFAULT,
})
export class AppService {
  private isAbc = false;
  private thisIsKernelBaseConfigurationKey: string;
  private postcodeRegex: RegExp;

  @Inject(CurlService)
  private readonly curlService: CurlService;

  @Inject(SsdbService)
  private readonly ssdbService: SsdbService;

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService, private readonly configService: ConfigService, private readonly apiGetterService: ApiGetterService) {
    // console.log("new AppService");
    if (this.apiGetterService.isAbc) {
      this.isAbc = true;
    }

    // If any of the environment variables are missing, the server will fail the startup process including the error message
    const thisIsKernelBaseConfigurationKey = this.configService.get<string>('level1.level2');
    if (!thisIsKernelBaseConfigurationKey) {
      throw new Error(`level1.level2 Environment variables are missing`);
    }

    const postCodeRegex = this.configService.get<RegExp>('regex.postcode');
    if (!postCodeRegex) {
      throw new Error(`Regex postcode validation required`);
    }

    this.thisIsKernelBaseConfigurationKey = thisIsKernelBaseConfigurationKey;
    this.postcodeRegex = postCodeRegex;
  }

  getData(): {
    message: string;
    isAbc: boolean;
    some_insensitive_key_in_environment_ts?: string;
    some_secret_key_in_env_file?: string;
    some_secret_key2_in_env_file?: string;
    some_secret_key3_in_env_file?: string;
    some_service_related_key?: string;
    request_id?: string;
    an_object?: anObject;
    config_default_value: string;
  } {
    const context = 'xxx';
    // this.logger.log('a log message', context);
    Logger.log('a log message', context);
    // this.logger.warn('a warn message', context);
    Logger.warn('a warn message', context);
    // this.logger.info('an info message', 'xxxlo');
    // this.logger.error('an error message', ['stack_trace1', 'stack_trace2'], {"shit": context + "_haha_error_le"});
    Logger.error('an error message', ['stack_trace1', 'stack_trace2'], { shit: context + '_haha_error_le' });

    // console.log(this.apiGetterService.isAbc)

    const context2 = { a: 'A', s: context };
    // this.logger.log('log_a_obj', context2);

    Logger.log('log_a_obj', context2);

    // throw new Error('Oh small!');

    return {
      message: `Welcome to ${GlobalVars.appName}! `,
      isAbc: this.isAbc,
      some_insensitive_key_in_environment_ts: environment.some_insensitive_key_in_environment_ts,
      some_secret_key_in_env_file: process.env.SOME_SECRET_KEY_IN_ENV,
      some_secret_key2_in_env_file: process.env.SOME_SECRET_KEY2_IN_ENV,
      some_secret_key3_in_env_file: process.env.SOME_SECRET_KEY3_IN_ENV,
      some_service_related_key: this.thisIsKernelBaseConfigurationKey,
      request_id: RequestContext.currentContext.req.requestID,
      an_object: this.configService.get<anObject>('an_object'),
      config_default_value: this.configService.get<string>('non_exist_key', 'aaa_kkk'),
    };
  }

  async doCurl() {
    const responseGet = await this.curlService.curlGet('http://localhost:8889/cats');
    const responsePost = await this.curlService.curlPost('http://localhost:8889/cats', { a: 'A' });
    const responsePostJson = await this.curlService.curlPostJson('http://localhost:8889/cats', { a: 'A' });

    const formData = new FormData();
    formData.append('my_field', 'my value');
    formData.append('my_buffer', Buffer.alloc(10));
    formData.append('my_file', fs.createReadStream('I:/[nestjs-full-scaffold]-app-error-log-cpu0-2022-10-31.json'));
    const responsePostFile = await this.curlService.curlPostFile('http://localhost:8889/cats', formData);

    const { status: status1, statusText: statusText1, data: data1 } = responseGet;
    const { status: status2, statusText: statusText2, data: data2 } = responsePost;
    const { status: status3, statusText: statusText3, data: data3 } = responsePostJson;
    const { status: status4, statusText: statusText4, data: data4 } = responsePostFile;
    return {
      curl_get: { status: status1, statusText: statusText1, data: data1, error: status1 === 'error' },
      curl_post: { status: status2, statusText: statusText2, data: data2, error: status2 === 'error' },
      curl_json: { status: status3, statusText: statusText3, data: data3, error: status2 === 'error' },
      curl_file: { status: status4, statusText: statusText4, data: data4, error: status4 === 'error' },
    };
  }

  async getUser(c: any) {
    if (c) {
      return {
        count: await this.prismaService.user.count({where: {id: {gt: 0}}})
      }  
    }
    await this.prismaService.user.create({data: {username: Math.random()+""}});
    return {
      user: await this.prismaService.user.findMany({where: {id: {lte: 680}}, take: 10, orderBy: {id: "desc"}})
    }
  }

  async getLoggedRequestLists(dateStr: string) {
    const reqKey = sprintf(HttpResponseService.KEY_OF_REQ, GlobalVars.appName, dateStr);
    return await this.ssdbService.ssdbStore.lrange(reqKey, 0, -1);
  }

  generateToken(ori: string, timestam: any) {
    const secret = process.env.JWT_TOKEN_SECRET as string;
    const sha256 = crypto.createHmac("SHA256", secret);
    const timestamp = timestam ?? new Date().getTime();
    const mychecksum = sha256.update(`${ori}${timestamp}`).digest('hex');
    return `${ori}.${timestamp}.${mychecksum}`;
  }
}
