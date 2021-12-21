import { ApiProperty } from '@nestjs/swagger';
import { WalletLabel } from './walletLabel';
 

export class WalletAddressInfoViewModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  chainType: string;

  @ApiProperty()
  contractAddress: string;

  @ApiProperty()
  walletAddress: string;

  @ApiProperty({
    description:
      'the customized labels and tags marked for the wallet address, this column is stored as json string',
  })
  labels: WalletLabel[];

  @ApiProperty({ description: 'the balance of wallet address' })
  balance: number;

  @ApiProperty({ description: 'the timestamp (seconds) of first transaction occured' })
  firstInDate: number;

  constructor() {
    this.labels = [];
  }
}
