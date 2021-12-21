import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/orm/database.module';
import { repositoryProviders } from 'src/common/orm/repository.providers';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
@Module({
  imports: [DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),],
  controllers: [UserController],
  providers: [...repositoryProviders, UserService, LocalStrategy, JwtStrategy],
})
export class UserModule { }
