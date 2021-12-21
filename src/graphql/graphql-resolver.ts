import { Inject, Injectable } from "@nestjs/common";
import { PolkParaChain } from "src/common/entity/PolkParaChainModule/polkParaChain.entity";
import { RepositoryConsts } from "src/common/orm/repositoryConsts";
import { FindManyOptions, In, Repository } from 'typeorm';


@Injectable()
export class GraphQLResolver {
    constructor(
        @Inject(RepositoryConsts.KUSAMA_PARA_CHAIN_REPOSITORY)
        private pcRepository: Repository<PolkParaChain>,
    ) { }

    getGraphqlResolverRoot() {
        return {
            parachains: async () => {
                let records = await this.pcRepository.find();
                if (records) {
                    return records;
                }
                return [];
            },
        };
    };
}
