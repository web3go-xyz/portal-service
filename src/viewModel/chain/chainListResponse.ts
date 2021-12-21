import { ApiProperty } from '@nestjs/swagger';
import { ChainType } from 'src/common/entity/ERC20Module/chainType.entity';

export class ChainListResponse {
  @ApiProperty()
  public list: ChainType[];
}
