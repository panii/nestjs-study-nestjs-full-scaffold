import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { ConfigService } from '@nestjs/config';

import { AppModule } from './kernel/app.module';
import { GlobalVars } from './kernel/global.vars';
import { LoggerProxy } from './kernel/logger-proxy';
import { HttpInterceptor } from './kernel/interceptors/http-interceptor';
import { HttpExceptionFilter } from './kernel/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  LoggerProxy.proxyLogger(app);
  app.useGlobalInterceptors(new HttpInterceptor(parseInt(process.env.HTTP_TIMEOUT as string)));
  // const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(GlobalVars.appName);
  app.getHttpAdapter().getInstance().set('json spaces', 2); // when use express, you can globally print pretty json
  const port = process.env.PORT || 3335;
  const server = await app.listen(port);
  server.timeout = 1000 + parseInt(process.env.TCP_TIMEOUT as string); // tcp timeout set to X
  // const configService = app.get(ConfigService);
  // const tm = configService.get('TM');
  const tm = process.env.TM || '';
  Logger.log(`🚀 ${tm} Application is running on: http://localhost:${port}/${GlobalVars.appName}`);
  LoggerProxy.inited = true;

  if (process.send) process.send('ready') // pm2 start ecosystem.config.js --only "nestjs-full-scaffold"
}

bootstrap();
