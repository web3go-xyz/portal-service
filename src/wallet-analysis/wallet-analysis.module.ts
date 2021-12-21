import { Module } from '@nestjs/common';

import { WalletAnalysisController } from './wallet-analysis.controller';
import { WalletAnalysisService } from './wallet-analysis.service';
import { repositoryProviders } from 'src/common/orm/repository.providers';
import { DatabaseModule } from 'src/common/orm/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WalletAnalysisController],
  providers: [...repositoryProviders, WalletAnalysisService],
})
export class WalletAnalysisModule {}
