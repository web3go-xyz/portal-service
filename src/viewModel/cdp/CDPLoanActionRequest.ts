import { ApiProperty } from '@nestjs/swagger';
import { CDPBaseRequest } from './CDPBaseRequest';

export class CDPLoanActionRequest extends CDPBaseRequest {

  @ApiProperty()
  public accountId: string;
}
