import { ApiProperty } from "@nestjs/swagger";

export class UserInfo {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    displayName: string = "";

    @ApiProperty()
    email: string = "";

    @ApiProperty()
    imageBase64: string = "";
}