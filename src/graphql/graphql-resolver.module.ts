import { Module } from '@nestjs/common';

import { databaseProviders_polkadot } from 'src/common/orm/database.providers.v2';
import { GraphQLResolver } from './graphql-resolver';
import { repositoryProviders_polkadot } from 'src/common/orm/repository.providers.v2';


@Module({
  imports: [],
  controllers: [],
  providers: [...databaseProviders_polkadot, ...repositoryProviders_polkadot, GraphQLResolver],
  exports: [GraphQLResolver]
})
export class GraphQLResolverModule { }
