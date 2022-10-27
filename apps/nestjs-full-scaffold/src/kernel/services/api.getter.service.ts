import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({
  scope: Scope.DEFAULT
})
export class ApiGetterService {
  constructor(private readonly configService: ConfigService) {
    // console.log('new instance of ApiGetterService')
  }

  get isAbc(): boolean { // We may also add getter functions to enable a little more natural coding style:
    // if (!GlobalVars.pjf) GlobalVars.pjf = this;
    // else console.log(GlobalVars.pjf === this, 'GlobalVars.pjf === this')
    // console.log(GlobalVars.pjf)
    return this.configService.get('level1.level2') === 'aaabbbccc';
  }
}