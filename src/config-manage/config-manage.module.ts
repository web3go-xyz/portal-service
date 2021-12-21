import { CacheModule, Module } from '@nestjs/common';

import { repositoryProviders } from 'src/common/orm/repository.providers';
import { DatabaseModule } from 'src/common/orm/database.module';
import { ConfigManageController } from './config-manage.controller';
import { ConfigManageService } from './config-manage.service';

@Module({
  imports: [DatabaseModule, CacheModule.register({
    ttl: 15
  }),],
  controllers: [ConfigManageController],
  providers: [...repositoryProviders, ConfigManageService],
})
export class ConfigManageModule { }
