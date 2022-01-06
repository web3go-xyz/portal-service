import { ApiProperty } from '@nestjs/swagger';
import { CDPBaseRequest } from './CDPBaseRequest';

export class CDPLoanPositionRequest extends CDPBaseRequest {
  @ApiProperty({ default: '' })
  public accountId: string;

  @ApiProperty({ default: [] })
  public filterStatus: string[];

  @ApiProperty({ default: false })
  public hideLoanCompleted: boolean;
}
