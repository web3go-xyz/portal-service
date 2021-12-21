import { Module } from '@nestjs/common';

import { repositoryProviders } from 'src/common/orm/repository.providers';
import { DatabaseModule } from 'src/common/orm/database.module';
import { GraphQLResolver } from './graphql-resolver';


@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...repositoryProviders, GraphQLResolver],
  exports: [GraphQLResolver]
})
export class GraphQLResolverModule { }
