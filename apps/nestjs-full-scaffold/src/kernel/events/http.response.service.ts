import { Injectable, Scope } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { OnEvent } from "@nestjs/event-emitter";
import { Response } from 'express';

@Injectable({
    scope: Scope.DEFAULT // Event subscribers cannot be request-scoped.
})
export class HttpResponseService {
  // @OnEvent('kernel.*')
  @OnEvent('kernel.HttpException', { async: true, nextTick: true })
  handleHttpExceptionEvent(ctx: HttpArgumentsHost) {
    // handle and process an event
    const response = ctx.getResponse<Response>();
    //response.header('Event-subscriber', 'kernel.HttpException');
    console.log("Do error push notify when HttpException occured, statusCode: " + response.statusCode)
  }

  @OnEvent('kernel.Responsed', { async: true, nextTick: true })
  handleHttpResponsedEvent(body: unknown) {
    // handle and process an event
    console.log("Do log response when end response, body: ", body);
  }
}
