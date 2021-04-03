import { Pipe, PipeTransform } from '@angular/core';
import { RiskStatus } from '../entities/risk-status.enum';

@Pipe({
  name: 'riskStatus'
})
export class RiskStatusPipe implements PipeTransform {

  transform(value: string): unknown {

    return RiskStatus[value];
  }

}
