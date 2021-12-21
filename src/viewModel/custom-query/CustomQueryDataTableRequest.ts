import { ApiProperty } from "@nestjs/swagger";

export class CustomQueryDataTableRequest {
    @ApiProperty({ description: 'the schema name which current table belong', default: 'ido-dev' })
    schema: string;

    @ApiProperty({ description: 'the schema type of token category', default: 'ERC20' })
    schemaType: string = "ERC20";

    @ApiProperty({ description: 'the name list of tables, default is empty, means all tables will be returned.', default: [] })
    filterTableNames: string[];
}
