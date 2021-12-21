import { ApiProperty } from "@nestjs/swagger";

export class CodeVerifyRequest {
    @ApiProperty()
    userId: number;

    @ApiProperty({ description: 'code from email received' })
    code: string;
}