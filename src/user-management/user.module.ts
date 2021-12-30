import { Module } from '@nestjs/common';
import { databaseProviders_main } from 'src/common/orm/database.providers.v2';
import { repositoryProviders_main } from 'src/common/orm/repository.providers.v2';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UserController],
  providers: [
    ...databaseProviders_main,
    ...repositoryProviders_main,
    UserService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class UserModule {}
