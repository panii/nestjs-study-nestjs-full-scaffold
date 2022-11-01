import { Injectable, Scope } from '@nestjs/common';
import { SnowflakeIdv1 } from 'simple-flakeid';

@Injectable({
  scope: Scope.DEFAULT
})
export class SnowFlakeV2Service {
  public gen: SnowflakeIdv1;

  constructor() {
    const WorkerId = process.env.INSTANCE_ID == undefined ? 1 : process.env.WorkerId;
    const WorkerIdd = Number(WorkerId) + 1;

    this.gen = new SnowflakeIdv1({ workerId: WorkerIdd, seqBitLength: 6, baseTime: 1666886600000 }); // 2022-10-28T00:03:20+08:00
  }
}
