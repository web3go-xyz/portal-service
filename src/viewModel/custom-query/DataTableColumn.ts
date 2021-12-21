import { ApiProperty } from "@nestjs/swagger";

export class DataTableColumn {
    @ApiProperty({ description: 'the column name' })
    columnName: string;

    @ApiProperty({ description: 'the data type' })
    dataType: string;

    @ApiProperty({ description: 'the comment of current column' })
    columnComment: string;
}