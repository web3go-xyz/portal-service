import { ApiProperty } from "@nestjs/swagger";
import { AnalyticsInsightDashboard } from "src/common/entity/CustomQueryModule/AnalyticsInsightDashboard.entity";
import { PageRequest } from "../base/pageRequest";
import { PageResponse } from "../base/pageResponse";

export class QueryDataBoardListRequest extends PageRequest {
    @ApiProperty({ default: [] })
    id_filter: number[];

}
export class QueryDataBoardListResponse extends PageResponse {
    @ApiProperty()
    list: AnalyticsInsightDashboard[]
}
