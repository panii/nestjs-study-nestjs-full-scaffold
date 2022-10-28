import { Module, Global } from '@nestjs/common';
import { DumpService } from './dump.service';

@Global()
@Module({
  providers: [DumpService],
  exports: [DumpService],
})
export class NestjsjsondumpModule {}
