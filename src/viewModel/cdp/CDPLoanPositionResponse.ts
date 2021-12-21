import { ApiProperty } from '@nestjs/swagger';
import { LoanPosition } from 'src/common/entity/CDPModule/loanPosition.entity';
import { PageResponse } from '../base/pageResponse';

export class CDPLoanPositionResponse extends PageResponse {
  @ApiProperty({ type: LoanPosition, isArray: true })
  public list: LoanPosition[] = [];


}
