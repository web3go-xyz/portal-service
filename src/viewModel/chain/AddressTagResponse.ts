import { ApiProperty } from '@nestjs/swagger';
import { AddressTag } from 'src/common/entity/CommonModule/addressTag.entity';

export class AddressTagResponse {
  @ApiProperty()
  public list: AddressTag[];

  constructor() {
    this.list = [];
  }
}
