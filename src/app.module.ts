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
    //UserModule - module (nestjs module) for web3go registered user info
    UserModule,
    //WalletAnalysisModule - module for chain and wallet address info
    WalletAnalysisModule,
    //ConfigManageModule - module for wallet label and address tag
    ConfigManageModule,
    //CDPAnalysisModule - module for CDP Analysis
    CDPAnalysisModule,
    //CustomQueryModule - module for custom query service
    CustomQueryModule,
    //GraphQLResolverModule - module for graphql resolver
    GraphQLResolverModule,
    //PlatformModule - module for platform info service
    PlatformModule,
    //GraphQLResolverModule - module for analytics insight page control 
    AnalyticsInsightModule
  ],
  controllers: [AppController],
  providers: [AppService, ParaChainService],
})
export class AppModule { }
