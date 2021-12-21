import { ApiProperty } from "@nestjs/swagger";

export class UserInfoUpdateRequest {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    displayName: string = "";

    @ApiProperty({ description: 'image base64 characters as user logo' })
    imageBase64: string = "";

}