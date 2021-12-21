import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { AuthUser } from './authUser';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: UserService) {
        super();
    }

    async validate(username: string, password: string): Promise<AuthUser> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException("username or password invalid, please check");
        }

        let authUser: AuthUser = { userId: user.userId, username: user.email };
        console.log("validate user:", authUser);

        return authUser;

    }
}

