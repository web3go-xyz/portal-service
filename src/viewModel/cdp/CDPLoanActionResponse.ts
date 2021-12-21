import { ApiProperty } from '@nestjs/swagger';
import { LoanAction } from 'src/common/entity/CDPModule/loanAction.entity';
import { PageResponse } from '../base/pageResponse';

export class CDPLoanActionResponse extends PageResponse {
  @ApiProperty({ type: LoanAction, isArray: true })
  public list: LoanAction[] = [];


}
