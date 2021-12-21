import { ApiProperty } from "@nestjs/swagger";

export class DataBoardViewCountResponse {
    @ApiProperty({ description: 'id for databoard' })
    dataBoardId: string;

    @ApiProperty({ description: 'viewCount for databoard' })
    viewCount: number;
}
