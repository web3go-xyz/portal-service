import { ApiProperty } from '@nestjs/swagger';
import { CDPBaseRequest } from './CDPBaseRequest';

export class CDPLoanPositionRequest extends CDPBaseRequest {

  @ApiProperty()
  public accountId: string;

  @ApiProperty()
  public filterStatus: string[];

  @ApiProperty()
  public hideLoanCompleted: boolean;
}
