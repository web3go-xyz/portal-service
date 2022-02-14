import { ApiProperty } from "@nestjs/swagger";
import { AnalyticsInsightDashboard } from "src/common/entity/CustomQueryModule/AnalyticsInsightDashboard.entity";

export class PublishDataBoardRequest extends AnalyticsInsightDashboard {

}
export class PublishDataBoardResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    dashboard_id: string;

    @ApiProperty()
    name: string;
}
