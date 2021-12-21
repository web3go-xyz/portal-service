import { ApiProperty } from '@nestjs/swagger';
import { PageRequest } from '../base/pageRequest';

export class CDPBaseRequest extends PageRequest {
  @ApiProperty({ default: 'Karura' })
  public chain: string = 'Karura';
  @ApiProperty({ default: 'KSM' })
  public symbol: string = 'KSM';
}
