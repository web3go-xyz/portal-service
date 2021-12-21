import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordRequest {
    @ApiProperty()
    userId: number;

    @ApiProperty({ description: 'code from email received' })
    code: string;

    @ApiProperty({ description: 'new password' })
    newPassword: string;
}