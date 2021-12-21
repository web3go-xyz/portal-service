import { ApiProperty } from "@nestjs/swagger";
import { DataTableColumn } from "./DataTableColumn";

export class DataTable {
    @ApiProperty({ description: 'the name of table' })
    tableName: string;
    @ApiProperty({ description: 'the schema name which current table belong' })
    schema: string;

    @ApiProperty({ description: 'the comment of table' })
    tableComment: string;

    @ApiProperty({ description: 'the columns of table' })
    columns: DataTableColumn[];
}