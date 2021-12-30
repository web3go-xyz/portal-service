import { CacheModule, Module } from '@nestjs/common';

import {
  databaseProviders_main,
  databaseProviders_erc20,
} from 'src/common/orm/database.providers.v2';
import {
  repositoryProviders_main,
  repositoryProviders_erc20,
} from 'src/common/orm/repository.providers.v2';

import { ConfigManageController } from './config-manage.controller';
import { ConfigManageService } from './config-manage.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 15,
    }),
  ],
  controllers: [ConfigManageController],
  providers: [
    ...databaseProviders_main,
    ...databaseProviders_erc20,
    ...repositoryProviders_main,
    ...repositoryProviders_erc20,
    ConfigManageService,
  ],
})
export class ConfigManageModule {}
