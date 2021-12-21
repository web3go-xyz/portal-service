import { ApiProperty } from '@nestjs/swagger';

export class CustomQueryRequest {
  @ApiProperty({ default: 0 })
  public id: number;

}
