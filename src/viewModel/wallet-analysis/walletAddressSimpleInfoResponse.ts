import { ApiProperty } from '@nestjs/swagger';
import { WalletAddressInfoViewModel } from './walletAddressInfoViewModel';

export class WalletAddressSimpleInfoResponse {
  @ApiProperty()
  public list: WalletAddressInfoViewModel[];

  constructor() {
    this.list = [];
  }
}
