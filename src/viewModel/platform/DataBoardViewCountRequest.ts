import { ApiProperty } from "@nestjs/swagger";

export class DataBoardViewCountRequest {
    @ApiProperty({ description: 'id for databoard' })
    dataBoardId: string; 
}
