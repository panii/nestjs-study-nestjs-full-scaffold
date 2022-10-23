import { Controller, Get, Req, Res, HttpStatus, Inject, HttpException } from '@nestjs/common';
import { EventPattern, Transport, ClientProxy, Payload, Ctx, MqttRecordBuilder, MqttContext } from '@nestjs/microservices';
import { Request, Response } from 'express';

import { AppService } from '../services/app.service';
import { GlobalVars } from '../global.vars';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject('MQTT_CLIENT') private readonly mqttClient: ClientProxy) {}

  @Get('/env-example')
  getData(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.header('Name', AppController.name);
    res.status(HttpStatus.OK);
    return this._getData(parseInt(req.query['duration'] as string));
  }

  @Get('/exception-example')
  getException(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    throw new HttpException(
      {
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN
    );
  }

  @Get('/env-example-use-raw-response')
  getDataPretty(@Req() req: Request, @Res() res: Response) {
    // if (!GlobalVars.pjf) GlobalVars.pjf = req;
    // console.log(GlobalVars.pjf === req)
    // console.log(GlobalVars.pjf)

    const data = this._getData2();
    res.header('Content-type', 'application/json; charset=utf-8').status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
  }

  @Get('/benchmark/hello-world')
  benchmarkHelloWorld() {
    const userProperties = { 'x-version': '1.0.0' }; // protocolVersion: 5 , only mqtt 5 support extra properties
    const record = new MqttRecordBuilder('hahaha, this is mqtt message').setProperties({ userProperties }).setQoS(2).build();
    console.log(record);
    this.mqttClient.emit('mqtt_event_1', record);

    return { hello: 'world' };
  }

  @EventPattern('mqtt_event_1', Transport.MQTT)
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
}
