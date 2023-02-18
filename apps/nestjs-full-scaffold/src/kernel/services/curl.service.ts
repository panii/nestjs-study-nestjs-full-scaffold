import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of, catchError, firstValueFrom } from 'rxjs';
import { RequestContext } from 'nestjs-request-context';

import { GlobalVars } from '../global.vars';
import { SsdbService } from './ssdb.service';
import * as Redis from 'ioredis'; // https://github.com/luin/ioredis
import * as qs from 'qs';
import * as FormData from 'form-data';

@Injectable({
  scope: Scope.DEFAULT,
})
export class CurlService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  ssdbStore: Redis;

  constructor(private readonly ssdbService: SsdbService) {
    if (process.env.SSDB_LOG_REQ_RES_ENABLE === 'yes') {
      this.ssdbStore = this.ssdbService.ssdbStore;
    } else {
      this.ssdbStore = null;
    }
  }

  async curlGet(url: string, params: { [key: string]: any } = {}, headers: Record<string, string | number | boolean> = {}) {
    const url2 = Object.keys(params).length === 0 ? url : url.includes('?') ? url + '&' + qs.stringify(params, {arrayFormat: 'repeat'}) : url + '?' + qs.stringify(params, {arrayFormat: 'repeat'});

    await this.logCurlRequest('GET', url2, {}, headers);

    const response = await firstValueFrom(
      // <<"GET /cats HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nX-Requested-With: nestjs/axios\r\nUser-Agent: axios/0.27.2\r\nHost: localhost:8888\r\nConnection: close\r\n\r\n">>
      this.httpService.get<string>(url2, { headers: headers }).pipe(
        catchError((error) => {
          if (error.response) {
            const {status, statusText, data, headers} = error.response;
            return of({status, statusText, data, headers});
          }
          return of({ status: 'error', statusText: error.message, headers: {}, data: 'connection error, see statusText' });
        })
      )
    );

    await this.logCurlResponse(response);

    return response;
    // console.log(response);
    // if (response.status === 'error') {
    //   return response.statusText;
    // }
    // if (response.status === 200 && response.statusText === 'OK') {
    //   return response.data;
    // }
  }

  async curlPost(url: string, params: { [key: string]: any }, headers: Record<string, string | number | boolean> = {}) {
    await this.logCurlRequest('POST', url, params, headers);
    const response = await firstValueFrom(
      // <<"POST /cats HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nContent-Type: application/x-www-form-urlencoded\r\nX-Requested-With: nestjs/axios\r\nUser-Agent: axios/0.27.2\r\nContent-Length: 3\r\nHost: localhost:8888\r\nConnection: close\r\n\r\na=A">>
      this.httpService.post<string>(url, qs.stringify(params), { headers: headers }).pipe(
        catchError((error) => {
          if (error.response) {
            const {status, statusText, data, headers} = error.response;
            return of({status, statusText, data, headers});
          }
          return of({ status: 'error', statusText: error.message, headers: {}, data: 'connection error, see statusText' });
        })
      )
    );

    await this.logCurlResponse(response);

    return response;
  }

  async curlPostJson(url: string, params: { [key: string]: any }, headers: Record<string, string | number | boolean> = {}) {
    await this.logCurlRequest('POST_JSON', url, params, headers);
    const response = await firstValueFrom(
      // <<"POST /cats HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nContent-Type: application/json\r\nX-Requested-With: nestjs/axios\r\nUser-Agent: axios/0.27.2\r\nContent-Length: 9\r\nHost: localhost:8888\r\nConnection: close\r\n\r\n{\"a\":\"A\"}">>
      this.httpService.post<string>(url, params, { headers: headers }).pipe(
        catchError((error) => {
          if (error.response) {
            const {status, statusText, data, headers} = error.response;
            return of({status, statusText, data, headers});
          }
          return of({ status: 'error', statusText: error.message, headers: {}, data: 'connection error, see statusText' });
        })
      )
    );

    await this.logCurlResponse(response);

    return response;
  }

  async curlPostFile(url: string, formData: FormData, headers: Record<string, string | number | boolean> = {}) {
    /*
    const formData = new FormData();
    formData.append('my_field', 'my value');
    formData.append('my_buffer', new Buffer(10));
    formData.append('my_file', fs.createReadStream('I:/[nestjs-full-scaffold]-app-error-log-cpu0-2022-10-31.json'));
    POST /cats HTTP/1.1
Accept: application/json, text/plain
content-type: multipart/form-data; boundary=--------------------------555679728419864416224993
X-Requested-With: nestjs/axios
a: A
User-Agent: axios/0.27.2
Host: localhost:8889
Connection: close
Transfer-Encoding: chunked

69
----------------------------555679728419864416224993
Content-Disposition: form-data; name="my_field"


8
my value
2


92
----------------------------555679728419864416224993
Content-Disposition: form-data; name="my_buffer"
Content-Type: application/octet-stream


a
◦◦◦◦◦◦◦◦◦◦
2


ce
----------------------------555679728419864416224993
Content-Disposition: form-data; name="my_file"; filename="[nestjs-full-scaffold]-app-error-log-cpu0-2022-10-31.json"
Content-Type: application/json


3
123
3a

----------------------------555679728419864416224993--

0
    */
    // await this.logCurlRequest('POST_JSON', url, params, headers);
    const response = await firstValueFrom(
      // <<"POST /cats HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nContent-Type: application/json\r\nX-Requested-With: nestjs/axios\r\nUser-Agent: axios/0.27.2\r\nContent-Length: 9\r\nHost: localhost:8888\r\nConnection: close\r\n\r\n{\"a\":\"A\"}">>
      this.httpService.post<string>(url, formData, { headers: headers }).pipe(
        catchError((error) => {
          if (error.response) {
            const {status, statusText, data, headers} = error.response;
            return of({status, statusText, data, headers});
          }
          return of({ status: 'error', statusText: error.message, headers: {}, data: 'curl error, see statusText' });
        })
      )
    );

    // await this.logCurlResponse(response);

    return response;
  }

  async logCurlRequest(method, url, params, headers)
  {
    const httpContext = RequestContext.currentContext;
    if (httpContext && this.ssdbStore) {
      const req = httpContext.req;
      await this.ssdbStore.lpush(`${GlobalVars.appName}:CURL-SERVICE:${req.requestID}`, 'Req-' + JSON.stringify({ method: method, url: url, params: params, headers: headers }));
    }
    // const req = httpContext.req;
    // console.log(`${GlobalVars.appName}:CURL-SERVICE:${req.requestID}`, 'Req-' + JSON.stringify({ method: method, url: url, params: params, headers: headers }));
  }

  async logCurlResponse({status, statusText, data, headers})
  {
    const httpContext = RequestContext.currentContext;
    if (httpContext && this.ssdbStore) {
      const req = httpContext.req;
      await this.ssdbStore.lpush(`${GlobalVars.appName}:CURL-SERVICE:${req.requestID}`, 'Res-' + JSON.stringify({status, statusText, data, headers}));
    }
    // const req = httpContext.req;
    // console.log(`${GlobalVars.appName}:CURL-SERVICE:${req.requestID}`, 'Res-' + JSON.stringify({status, statusText, data, headers}));
  }
}
