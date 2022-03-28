import { Module } from '@nestjs/common';
// import { StatusMonitorModule } from 'nestjs-status-monitor';
import { AnalyticsInsightModule } from './analytics-insight/analytics-insight.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CDPAnalysisModule } from './cdp-analysis/cdp-analysis.module';
import { ConfigManageModule } from './config-manage/config-manage.module';
import { CustomQueryModule } from './custom-query/custom-query.module';
import { GraphQLResolverModule } from './graphql/graphql-resolver.module';
import { ParaChainService } from './parachain/ParaChainService';
import { PlatformModule } from './platform/platform.module';
import { UserModule } from './user-management/user.module';
import { WalletAnalysisModule } from './wallet-analysis/wallet-analysis.module';
@Module({
  imports: [
    // StatusMonitorModule.forRoot(),
    UserModule,
    WalletAnalysisModule,
    ConfigManageModule,
    CDPAnalysisModule,
    CustomQueryModule,
    GraphQLResolverModule,
    PlatformModule,
    AnalyticsInsightModule
  ],
  controllers: [AppController],
  providers: [AppService, ParaChainService],
})
export class AppModule { }
