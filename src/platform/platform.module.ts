import { Module } from '@nestjs/common';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

import { databaseProviders_main } from 'src/common/orm/database.providers.v2';
import { repositoryProviders_main } from 'src/common/orm/repository.providers.v2';

@Module({
  imports: [],
  controllers: [PlatformController],
  providers: [
    ...databaseProviders_main,
    ...repositoryProviders_main,
    PlatformService,
  ],
})
export class PlatformModule {}
