import { ApiProperty } from '@nestjs/swagger';

export class WalletAddressTransactionRequest {
  @ApiProperty({ default: 'LIT' })
  public chainType: string;
  @ApiProperty({ default: '0x123456' })
  public contractAddress: string;

  @ApiProperty({
    default: '0x12345600001',
    description: 'wallet address',
  })
  public walletAddress: string;
  @ApiProperty({
    default: new Date().getUTCSeconds() - 60 * 60 * 24,
    description:
      'the filter start timestamp  (seconds) of transaction timestamp',
  })
  public transactionTimestampStart: number;
  @ApiProperty({
    default: new Date().getUTCSeconds(),
    description: 'the filter end timestamp (seconds) of transaction timestamp',
  })
  public transactionTimestampEnd: number;
}
