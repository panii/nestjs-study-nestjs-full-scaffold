import { Injectable, Scope, Inject, LoggerService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestContext } from 'nestjs-request-context';
// import { Logger } from 'winston';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { GlobalVars } from '../global.vars';
import { ApiGetterService } from './api.getter.service';
import { environment } from '../../environments/environment';


interface anObject {
  str: string;
  num: number;
}

@Injectable({
  scope: Scope.DEFAULT
})
export class AppService {
  private isAbc = false;
  private thisIsKernelBaseConfigurationKey: string;
  private postcodeRegex: RegExp;

  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService, private readonly configService: ConfigService, private readonly apiGetterService: ApiGetterService) {
    console.log("new AppService");
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
    const context = 'xxxlo';
    this.logger.log('a log message', context);
    Logger.log('a log message', context);
    this.logger.warn('a warn message', context);
    Logger.warn('a warn message', context);
    // this.logger.info('an info message', 'xxxlo');
    this.logger.error('an error message', ['stack_trace1', 'stack_trace2'], {"shit": context + "_haha_error_le"});
    Logger.error('an error message', ['stack_trace1', 'stack_trace2'], {"shit": context + "_haha_error_le"});

    // console.log(this.apiGetterService.isAbc)

    const context2 = { a: 'A', s: context };
    this.logger.log('log_a_obj', context2);
    
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
      request_id: RequestContext.currentContext.req.request_id,
      an_object: this.configService.get<anObject>('an_object'),
      config_default_value: this.configService.get<string>('non_exist_key', 'aaa_kkk'),
    };
  }
}
