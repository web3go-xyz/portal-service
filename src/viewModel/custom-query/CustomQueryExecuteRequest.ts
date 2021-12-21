import { ApiProperty } from "@nestjs/swagger";

export class CustomQueryExecuteRequest {
    @ApiProperty()
    orderByFields: string;

    @ApiProperty()
    recordCount: string;

    @ApiProperty()
    selectedFields: string[];

    @ApiProperty()
    selectedToken: string;


    @ApiProperty({ description: 'the schema of query will be executed' })
    schema: string;

    @ApiProperty({ description: 'the query sql' })
    queryExpression: string;

}
