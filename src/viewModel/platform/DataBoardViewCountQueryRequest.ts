import { ApiProperty } from "@nestjs/swagger";

export class DataBoardViewCountQueryRequest {
    @ApiProperty({ description: 'id array of databoard' })
    id_filter: string[];
}
