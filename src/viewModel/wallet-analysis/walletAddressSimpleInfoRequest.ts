import { ApiProperty } from '@nestjs/swagger';
import { OrderBy } from 'src/viewModel/base/orderBy';

export class WalletAddressSimpleInfoRequest {
  @ApiProperty()
  public chainType: string;
  @ApiProperty()
  public contractAddress: string;

  @ApiProperty({
    default: ['0x123', '0x456'],
    description: 'the list of wallet address',
  })
  public walletAddressList: string[];

  @ApiProperty({ default: [], type: [OrderBy] })
  public orderBy: OrderBy;
}
