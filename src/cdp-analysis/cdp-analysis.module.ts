import { Module } from '@nestjs/common';

import { repositoryProviders } from 'src/common/orm/repository.providers';
import { DatabaseModule } from 'src/common/orm/database.module';
import { CDPAnalysisService } from './cdp-analysis.service';
import { CDPAnalysisController } from './cdp-analysis.controller';
import { KVModule } from 'src/common/kv/kv.module';
import { KVService } from 'src/common/kv/kv.service';

@Module({
  imports: [DatabaseModule, KVModule],
  controllers: [CDPAnalysisController],
  providers: [...repositoryProviders, CDPAnalysisService, KVService],
})
export class CDPAnalysisModule { }
