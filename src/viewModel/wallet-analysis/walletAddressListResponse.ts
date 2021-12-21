import { ApiProperty } from '@nestjs/swagger';
import { WalletAddress } from 'src/common/entity/ERC20Module/walletAddress.entity';
import { PageResponse } from '../base/pageResponse';

export class WalletAddressListResponse extends PageResponse {
  @ApiProperty()
  public list: WalletAddress[];
}
