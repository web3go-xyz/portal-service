import { ApiProperty } from '@nestjs/swagger';
import { PageRequest } from '../base/pageRequest';
 

export class ChainWalletAddressRequest extends PageRequest {
  constructor() {
    console.log('ChainWalletAddressRequest constructor ');
    super();
  }

  @ApiProperty({
    description: 'find the walletAddress under the specified contractAddress',
  })
  public contractAddress: string;

  @ApiProperty({
    description: 'find the walletAddress with the specified label marked',
  })
  public label: string;

  @ApiProperty({ description: 'find the specified walletAddress' })
  public walletAddress: string;
}
