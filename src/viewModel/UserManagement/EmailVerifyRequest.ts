import { ApiProperty } from "@nestjs/swagger";

export class EmailVerifyRequest {
    @ApiProperty()
    email: string;
}