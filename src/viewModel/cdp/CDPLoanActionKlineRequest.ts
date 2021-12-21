import { ApiProperty } from '@nestjs/swagger';
import { CDPBaseRequest } from './CDPBaseRequest';

export class CDPLoanActionKlineRequest extends CDPBaseRequest {

  @ApiProperty()
  public accountId: string;

  @ApiProperty({
    description: 'start timestamp(UTC) of loanAction',
    default: (new Date('2021-12-01')).getTime()
  })
  public startTime: number;

  @ApiProperty({
    description: 'end timestamp(UTC) of loanAction',
    default: (new Date()).getTime()
  })
  public endTime: number;

  @ApiProperty({
    description: 'time interval for kline, default is 1h=1 hour, support: 1m(1 minute),5m(5 minutes),15m(15 minutes), 1h(1 hour), 1d(1 day)',
    default: '1h'
  })
  public timeInterval: string = "1h";
}
