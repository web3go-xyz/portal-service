import { ApiProperty } from "@nestjs/swagger";

export class Web3SignInChallengeResponse {

    identityNetwork: string;

    scope: string[];

    challenge: string;

    signature: string;

    address: string;

    verified: boolean;

    extra: string;
} 