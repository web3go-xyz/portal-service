import { ApiProperty } from '@nestjs/swagger';
import { ChainStatistic } from 'src/common/entity/CDPModule/chainStatistic.entity';

export class CDChainStatisticResponse extends ChainStatistic {
  @ApiProperty({ description: 'the scale of debit amount, the real amount should  be divided by the scale' })
  public debitScale: string = ('1e13');
  @ApiProperty({ description: 'the scale of collateral amount, the real amount should  be divided by the scale' })
  public collateralScale: string = ('1e12');
  @ApiProperty({ description: 'the ration step when calculate loan status with : Safe ,Warning, Danger' })
  public ratioPercentageStep: number = 10;

}
