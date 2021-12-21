import { ApiProperty } from '@nestjs/swagger';

export class WalletLabel {
  @ApiProperty({ description: 'the label marked by customized rules' })
  public labelName: string;
  @ApiProperty({ description: 'the label value calculated by rules' })
  public labelValue: string;
}
