import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transport } from '@nestjs/microservices';
// import { ConfigService } from '@nestjs/config';

import { AppModule } from './kernel/app.module';
import { GlobalVars } from './kernel/global.vars';
import { LoggerProxy } from './kernel/logger-proxy';
import { HttpInterceptor } from './kernel/interceptors/http-interceptor';
import { HttpExceptionFilter } from './kernel/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  LoggerProxy.proxyLogger(app);
  app.useGlobalInterceptors(new HttpInterceptor(parseInt(process.env.HTTP_TIMEOUT as string), app.get(EventEmitter2)));
  // const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(app.get(EventEmitter2)));
  app.setGlobalPrefix(GlobalVars.appName);
  app.getHttpAdapter().getInstance().set('json spaces', 2); // when use express, you can globally print pretty json
  const port = process.env.HTTP_PORT || 3335;
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  const server = await app.listen(port);
  server.timeout = 1000 + parseInt(process.env.TCP_TIMEOUT as string); // tcp timeout set to X
  // const configService = app.get(ConfigService);
  // const tm = configService.get('TM');
  const tm = process.env.TM || '';
  Logger.log(`🚀 ${tm} Application is running on: http://localhost:${port}/${GlobalVars.appName}`);
  LoggerProxy.inited = true;

  console.log('process.env.MQTT_SUBSCRIBE_ENABLE', process.env.MQTT_SUBSCRIBE_ENABLE);
  if (process.env.MQTT_SUBSCRIBE_ENABLE === 'yes') {
    app.connectMicroservice(
      {
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_SUBSCRIBE_URL
          // protocolVersion: 5,
        },
      },
      // { inheritAppConfig: true }
    );
  }
  console.log('process.env.REDIS_SUBSCRIBE_ENABLE', process.env.REDIS_SUBSCRIBE_ENABLE);
  if (process.env.REDIS_SUBSCRIBE_ENABLE === 'yes') {
    app.connectMicroservice(
      {
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_SUBSCRIBE_HOST,
          port: process.env.REDIS_SUBSCRIBE_PORT,
          keyPrefix: process.env.REDIS_SUBSCRIBE_KEY_PREFIX,
        },
      },
      // { inheritAppConfig: true }
    );
  }
  await app.startAllMicroservices();

  
  process.on('uncaughtException', function (err) {
    if (err.message === 'json_dump') return;
    Logger.error(err.message, err.stack);
  });

  // process.on('uncaughtExceptionMonitor', (err, origin) => {
  //   Logger.error(err.message, err.stack);
  // });

  if (process.send) process.send('ready'); // pm2 start ecosystem.config.js --only "nestjs-full-scaffold"
}

bootstrap();
