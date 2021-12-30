import { Module } from '@nestjs/common';

import { databaseProviders_cdp } from 'src/common/orm/database.providers.v2';
import { repositoryProviders_karura } from 'src/common/orm/repository.providers.v2';
import { CDPAnalysisService } from './cdp-analysis.service';
import { CDPAnalysisController } from './cdp-analysis.controller';
import { KVModule } from 'src/common/kv/kv.module';
import { KVService } from 'src/common/kv/kv.service';

@Module({
  imports: [KVModule],
  controllers: [CDPAnalysisController],
  providers: [...databaseProviders_cdp, ...repositoryProviders_karura, CDPAnalysisService, KVService],
})
export class CDPAnalysisModule { }
