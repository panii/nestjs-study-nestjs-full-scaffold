import { INestApplication } from '@nestjs/common';
import { GlobalVars } from './global.vars';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { WinstonLogger } from 'nest-winston/dist/winston.classes';
import { RequestContext } from 'nestjs-request-context';

export class LoggerProxy {
  static oldLogger: WinstonLogger;
  static oldLogFn: any;
  static oldWarnFn: any;
  static oldDebugFn: any;
  static oldErrorFn: any;
  static inited = false;

  static proxyLogger(app:INestApplication) {
    const oldLogger: WinstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    LoggerProxy.oldLogFn = oldLogger.log;
    LoggerProxy.oldWarnFn = oldLogger.warn;
    LoggerProxy.oldDebugFn = oldLogger.debug;
    LoggerProxy.oldErrorFn = oldLogger.error;

    oldLogger.log = LoggerProxy.log;
    oldLogger.warn = LoggerProxy.warn;
    oldLogger.debug = LoggerProxy.debug;
    oldLogger.error = LoggerProxy.error;

    app.useLogger(oldLogger);

    LoggerProxy.oldLogger = oldLogger;
  }

  static newContext(context) {
    let addForLogger;
    if (LoggerProxy.inited) {
      const httpContext = RequestContext.currentContext;
      if (httpContext) {
        addForLogger = {request_id: httpContext.req.request_id, url: httpContext.req.url, ...GlobalVars.getForLogger()};
      } else {
        addForLogger = GlobalVars.getForLogger();  
      }
    } else {
      addForLogger = GlobalVars.getForLogger();
    }
    if (typeof context !== 'undefined') {
      if (typeof context === 'string' || Array.isArray(context)) {
        return { from: context, ...addForLogger };
      } else {
        return { ...context, ...addForLogger };
      }
    } else {
      return addForLogger;
    }
  }

  static log(message: any, context?: string) {
    // console.log('log---------------');
    return LoggerProxy.oldLogFn.call(LoggerProxy.oldLogger, message, LoggerProxy.newContext(context));
  }

  static warn(message: any, context?: string) {
    // console.log('warn---------------');
    return LoggerProxy.oldWarnFn.call(LoggerProxy.oldLogger, message, LoggerProxy.newContext(context));
  }

  static debug(message: any, context?: string) {
    // console.log('debug---------------');
    return LoggerProxy.oldDebugFn.call(LoggerProxy.oldLogger, message, LoggerProxy.newContext(context));
  }

  static error(message: any, trace?: string, context?: string) {
    // console.log('error---------------');
    return LoggerProxy.oldErrorFn.call(LoggerProxy.oldLogger, message, trace, LoggerProxy.newContext(context));
  }
}
