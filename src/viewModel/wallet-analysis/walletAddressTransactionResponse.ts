import { ApiProperty } from '@nestjs/swagger';
import { WalletAddressTransactionViewModel } from './walletAddressTransactionViewModel';
 
export class WalletAddressTransactionResponse {
  @ApiProperty()
  public list: WalletAddressTransactionViewModel[];

  constructor() {
    this.list = [];
  }
}
