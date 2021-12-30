import { Module } from '@nestjs/common';

import { WalletAnalysisController } from './wallet-analysis.controller';
import { WalletAnalysisService } from './wallet-analysis.service';
import {
  databaseProviders_main,
  databaseProviders_erc20,
} from 'src/common/orm/database.providers.v2';
import {
  repositoryProviders_main,
  repositoryProviders_erc20,
} from 'src/common/orm/repository.providers.v2';
@Module({
  imports: [],
  controllers: [WalletAnalysisController],
  providers: [
    ...databaseProviders_main,
    ...databaseProviders_erc20,
    ...repositoryProviders_main,
    ...repositoryProviders_erc20,
    WalletAnalysisService,
  ],
})
export class WalletAnalysisModule {}
