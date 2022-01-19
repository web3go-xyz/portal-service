import { Module } from '@nestjs/common';
import { databaseProviders_main } from 'src/common/orm/database.providers.v2';
import { repositoryProviders_main } from 'src/common/orm/repository.providers.v2';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/auth/constants';
import { LocalStrategy } from 'src/common/auth/local.strategy';
import { JwtStrategy } from 'src/common/auth/jwt.strategy';
import { Web3SignInController } from './web3.signin.controller';
import { Web3SignInHelper } from './web3.signin/Web3SignInHelper';

import { KVService } from 'src/common/kv/kv.service';
import { KVModule } from 'src/common/kv/kv.module';
const authServiceProvider = {
  provide: 'LOCAL_AUTH_SERVICE',
  useExisting: UserService,

};
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    KVModule
  ],
  controllers: [UserController, Web3SignInController],
  providers: [
    ...databaseProviders_main,
    ...repositoryProviders_main,
    UserService,
    authServiceProvider,
    LocalStrategy,
    JwtStrategy,
    Web3SignInHelper,
    KVService
  ],
})
export class UserModule { }
