import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalVars } from '../global.vars';

@Injectable({
  // scope: Scope.REQUEST
})
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {
    console.log('new instance of ApiConfigService')
  }

  get isAbc(): boolean {
    if (!GlobalVars.pjf) GlobalVars.pjf = this.configService;
    else console.log(GlobalVars.pjf === this.configService)
    // console.log(GlobalVars.pjf)
    return this.configService.get('level1.level2') === 'aaabbbccc';
  }
}