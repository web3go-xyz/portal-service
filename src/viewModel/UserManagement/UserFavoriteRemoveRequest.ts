import { ApiProperty } from "@nestjs/swagger";

export class UserFavoriteRemoveRequest {

    @ApiProperty({ description: 'id for user favorite' })
    id: number;
}