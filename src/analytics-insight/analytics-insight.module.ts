import { Module } from '@nestjs/common';
import { AnalyticsInsightController } from './analytics-insight.controller';
import { AnalyticsInsightService } from './analytics-insight.service';

import { databaseProviders_main } from 'src/common/orm/database.providers.v2';
import { repositoryProviders_main } from 'src/common/orm/repository.providers.v2';

@Module({
  imports: [],
  controllers: [AnalyticsInsightController],
  providers: [
    ...databaseProviders_main,
    ...repositoryProviders_main,
    AnalyticsInsightService,
  ],
})
export class AnalyticsInsightModule { }
