import { ApiProperty } from '@nestjs/swagger';

export class CDPLoanActionKlineItem {

  @ApiProperty({ description: 'timestamp when action occured' })
  timestamp: number;

  @ApiProperty({ description: 'debit adjustment formated of this loanAction ', })
  debitAdjustmentFormat: number;

  @ApiProperty({ description: 'debit formated after this loanAction', })
  debitFormat: number;

  @ApiProperty({ description: 'collateral adjustment formated of this loanAction ', })
  collateralAdjustmentFormat: number;

  @ApiProperty({ description: 'collateral formated after this loanAction', })
  collateralFormat: number;

  @ApiProperty({ description: 'price of collateral at this very moment' })
  collateralPrice: number;

  @ApiProperty({ description: 'ratio percentage calculated at this very moment' })
  ratioPercentage: number;

  @ApiProperty({ description: 'status of current loanAction: Safe, Warning,Danger' })
  status: string = 'Safe';

}

export class CDPLoanActionKlineResponse {
  @ApiProperty({ type: CDPLoanActionKlineItem, isArray: true })
  public list: CDPLoanActionKlineItem[] = [];

  @ApiProperty()
  public totalCount: number;


}
