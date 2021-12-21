import { ApiProperty } from "@nestjs/swagger";

export class UserSignupRequest {
    @ApiProperty({ description: 'name used to display, like: Tom & Jerry' })
    displayName: string = "";


    @ApiProperty({ description: 'email used as login name' })
    email: string = "";

    @ApiProperty({ description: 'password , required at least 6 characters in front.' })
    password: string = "";


}