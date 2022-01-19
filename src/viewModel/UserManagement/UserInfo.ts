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

    @ApiProperty()
    isWeb3User: number = 0;

    @ApiProperty()
    twitter: string = "";

    @ApiProperty()
    github: string = "";
}