import { ApiProperty } from "@nestjs/swagger";

export class RemoveDataBoardRequest {
    @ApiProperty()
    id: number;

    @ApiProperty()
    dashboard_id: string;
}
export class RemoveDataBoardResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    dashboard_id: string;

    @ApiProperty()
    name: string;
}
