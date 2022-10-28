import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis'; // https://github.com/luin/ioredis

@Injectable()
export class SsdbService {
  public ssdbStore: Redis;
  
  constructor() {
    if (process.env.SSDB_LOG_REQ_RES_ENABLE === 'yes') {
      this.ssdbStore = new Redis(process.env.SSDB_LOG_REQ_RES_PORT, process.env.SSDB_LOG_REQ_RES_HOST); // https://github.com/luin/ioredis
    } else {
      this.ssdbStore = null;
    }
  }
}
