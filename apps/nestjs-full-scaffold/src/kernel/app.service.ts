import { Injectable, Scope, Inject, LoggerService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestContext } from 'nestjs-request-context';
// import { Logger } from 'winston';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { GlobalVars } from './global.vars';
import { ApiConfigService } from './api.config.service';
import { environment } from '../environments/environment';


@Injectable({
  // scope: Scope.REQUEST
})
export class AppService {
  private isAbc = false;

  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService, private readonly configService: ConfigService, private readonly apiConfigService: ApiConfigService) {
    console.log("new AppService");
    if (this.apiConfigService.isAbc) {
      this.isAbc = true;
    }
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
  } {
    // const port = this.configService.get<string>('PORT');
    // const env_key = this.configService.get<string>('ENV_KEY');
    const some_service_related_key = this.configService.get<string>('level1.level2');
    const context = 'xxxlo';
    this.logger.log('a log message', context);
    Logger.log('a log message', context);
    this.logger.warn('a warn message', context);
    Logger.warn('a warn message', context);
    // this.logger.info('an info message', 'xxxlo');
    this.logger.error('an error message', ['stack_trace1', 'stack_trace2'], {"shit": context + "_haha_error_le"});
    Logger.error('an error message', ['stack_trace1', 'stack_trace2'], {"shit": context + "_haha_error_le"});

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
      some_service_related_key: some_service_related_key,
      request_id: RequestContext.currentContext.req.request_id
    };
  }
}
