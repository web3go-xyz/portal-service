import { ApiProperty } from "@nestjs/swagger";

export class SS58transformRequest {
    @ApiProperty({ description: 'generic account address' })
    account: string;
    @ApiProperty({ description: 'specify the target networks; return all supported networks when leave it empty' })
    networks: string[];
}
