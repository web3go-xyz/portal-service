import { ApiProperty } from '@nestjs/swagger';

export class CDPLoanPositionStatisticResponse {

  @ApiProperty()
  public valueInvested: number = 0;

  @ApiProperty()
  public valueWithdraw: number = 0;

  @ApiProperty()
  public cdpBalance: number = 0;

  @ApiProperty()
  public lifetimeProfit: number = 0;
}
