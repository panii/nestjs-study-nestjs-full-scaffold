import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestContextMiddleware } from 'nestjs-request-context';
import { format, transports } from 'winston';
const { combine, timestamp, metadata, label, printf, json, colorize } = format;
import { WinstonModule } from 'nest-winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import TransportStream = require('winston-transport');

import { GlobalVars } from './global.vars';
import { environment } from '../environments/environment';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ApiGetterService } from './services/api.getter.service';
import { HttpMiddleware } from './middlewares/http-middleware';
import baseConfiguration from './configs/base.configuration';
import otherConfiguration from './configs/other.configuration';
import * as os from 'os';

import { sep, resolve } from 'path';

GlobalVars.appName = __dirname.split(sep).pop() as string;
GlobalVars.processId = process.pid + '';
GlobalVars.osHostName = os.hostname();

@Module({
  imports: [
    // env support
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfiguration, otherConfiguration],
      envFilePath: ['.env.development.local', '.env.development', '.env'].map((fileName) => resolve('dist', 'envs', GlobalVars.appName as string, fileName)),
      cache: true, // As accessing process.env can be slow, you can set the cache property of the options object passed to ConfigModule.forRoot() to increase the performance of ConfigService#get method when it comes to variables stored in process.env
      expandVariables: true,
    }),
    // daily logger support
    WinstonModule.forRoot({
      transports: [
        ...(function (): TransportStream[] {
          const application_log_to_file = process.env.APPLICATION_LOG_TO_FILE;
          const log_locale = process.env.LOG_LOCALE;
          const log_timezone = process.env.LOG_TIMEZONE;
          const application_log_dir = process.env.APPLICATION_LOG_DIR;
          const application_log_filename = process.env.APPLICATION_LOG_FILENAME;
          const application_error_log_filename = process.env.APPLICATION_ERROR_LOG_FILENAME;
          const dateTimeFormatOptions = {
            timeZone: log_timezone,
            hourCycle: 'h23',
            year: 'numeric',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          };

          if (application_log_to_file === 'yes' && log_locale && log_timezone && application_log_dir && application_log_filename && application_error_log_filename) {
            return [
              new DailyRotateFile({
                format: combine(
                  // label({ label: 'global-log' }),
                  timestamp({
                    format: () => {
                      return new Date().toLocaleString(log_locale, dateTimeFormatOptions as Intl.DateTimeFormatOptions);
                    },
                  }),
                  json()
                ),
                //handleExceptions: true, // With winston, it is possible to catch and log uncaughtException events from your process
                filename: `${application_log_dir}[${GlobalVars.appName}]-${application_log_filename}-%DATE%.json`,
                datePattern: 'YYYY-MM-DD',
                level: 'debug',
                //zippedArchive: true,
                //maxSize: ‘20m’,
                //maxFiles: ‘14d’,
              }),
              new DailyRotateFile({
                format: combine(
                  // label({ label: 'global-error-log' }),
                  timestamp({
                    format: () => {
                      return new Date().toLocaleString(log_locale, dateTimeFormatOptions as Intl.DateTimeFormatOptions);
                    },
                  }),
                  json()
                ),
                //handleExceptions: true, // With winston, it is possible to catch and log uncaughtException events from your process
                filename: `${application_log_dir}[${GlobalVars.appName}]-${application_error_log_filename}-%DATE%.json`,
                datePattern: 'YYYY-MM-DD',
                level: 'error',
              }),
              ...(!environment.production
                ? [
                    new transports.Console({
                      format: combine(
                        colorize(),
                        label({ label: 'console.log' }),
                        metadata(),
                        timestamp({
                          format: () => {
                            return new Date().toLocaleString(log_locale, dateTimeFormatOptions as Intl.DateTimeFormatOptions);
                          },
                        }),
                        printf((info) => {
                          const { level, message, metadata, timestamp } = info;
                          // console.log(info)
                          return `${timestamp} [${metadata.label}] ${level}: ${message} ` + JSON.stringify(metadata.context) + ` ${level.indexOf('error') !== -1 ? JSON.stringify(metadata.stack) : ''}`;
                        })
                      ),
                    }),
                  ]
                : []),
            ];
          } else {
            return [];
          }
        })(),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ApiGetterService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestContextMiddleware,
        HttpMiddleware // log every coming request
      )
      .exclude(`/${GlobalVars.appName}/benchmark/(.*)`)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
