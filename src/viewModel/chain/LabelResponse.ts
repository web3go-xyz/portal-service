import { ApiProperty } from '@nestjs/swagger';
import { LabelDef } from 'src/common/label/address.label.def';
export class LabelDefResponse {
  @ApiProperty()
  public list: LabelDef[];

  constructor() {
    this.list = [];
  }
}
