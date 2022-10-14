import { Controller, Get, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';
import { GlobalVars } from './global.vars';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/env-example')
  getData(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.header('Name', AppController.name);
    res.status(HttpStatus.OK);
    return this._getData(parseInt(req.query['duration'] as string));
  }
  
  @Get('/exception-example')
  getException(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    throw new HttpException({
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN);
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
    return {'hello':'world'};
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
