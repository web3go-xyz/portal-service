import { Module } from '@nestjs/common';

import {
    databaseProviders_cdp,
    databaseProviders_erc20,
    databaseProviders_kusama,
    databaseProviders_polkadot,
    databaseProviders_moonriver,
    databaseProviders_main,
    databaseProviders_moonbeam_balance,
} from 'src/common/orm/database.providers.v2';
import {
    repositoryProviders_karura,
    repositoryProviders_erc20,
    repositoryProviders_kusama,
    repositoryProviders_polkadot,
    repositoryProviders_main,
    repositoryProviders_moonriver,
    repositoryProviders_moonbeam_balance,
} from 'src/common/orm/repository.providers.v2';

import { CustomQueryController } from './custom-query.controller';
import { CustomQueryService } from './custom-query.service';

@Module({
    imports: [],
    controllers: [CustomQueryController],
    providers: [
        ...databaseProviders_cdp,
        ...databaseProviders_erc20,
        ...databaseProviders_kusama,
        ...databaseProviders_polkadot,
        ...databaseProviders_moonriver,
        ...databaseProviders_main,
        ...databaseProviders_moonbeam_balance,
        ...repositoryProviders_karura,
        ...repositoryProviders_erc20,
        ...repositoryProviders_kusama,
        ...repositoryProviders_polkadot,
        ...repositoryProviders_moonriver,
        ...repositoryProviders_main,
        ...repositoryProviders_moonbeam_balance,
        CustomQueryService,
    ],
})
export class CustomQueryModule { }
