import { Inject, Injectable } from '@nestjs/common';
import { MyLogger } from 'src/common/log/logger.service';
import { FindManyOptions, In, Repository } from 'typeorm';
import { RepositoryConsts } from 'src/common/orm/repositoryConsts';
import { PlatformStatistic } from 'src/common/entity/CommonModule/PlatformStatistic.entity';
import { DataBoardViewCountResponse } from 'src/viewModel/platform/DataBoardViewCountResponse';
import { DataBoardViewCountQueryRequest } from 'src/viewModel/platform/DataBoardViewCountQueryRequest';
@Injectable()
export class PlatformService {
    PlatformStatisticType_DataBoardViewCount: string = "DataBoardViewCount";

    constructor(
        @Inject(RepositoryConsts.PLATFORM_STATISTIC_REPOSITORY)
        private psRepository: Repository<PlatformStatistic>,
    ) {

    }

    async queryDataBoardViewCount(request: DataBoardViewCountQueryRequest): Promise<DataBoardViewCountResponse[]> {

        let resp: DataBoardViewCountResponse[] = [];
        let filter: FindManyOptions<PlatformStatistic> = {
            where: {
                PlatformStatisticType: this.PlatformStatisticType_DataBoardViewCount
            }
        };
        if (request.id_filter && request.id_filter.length > 0) {
            filter.where = {
                id: In(request.id_filter),
                PlatformStatisticType: this.PlatformStatisticType_DataBoardViewCount
            }
        }
        let records = await this.psRepository.find(filter);
        if (records) {
            records.forEach(t => {
                resp.push({
                    dataBoardId: t.PlatformStatisticKey,
                    viewCount: Number.parseInt(t.PlatformStatisticValue)
                })
            })
        }
        return resp;
    }
    async reportDataBoardViewCount(dataBoardId: string): Promise<any> {
        let record = await this.psRepository.findOne({
            where: {
                PlatformStatisticType: this.PlatformStatisticType_DataBoardViewCount,
                PlatformStatisticKey: dataBoardId
            }
        });
        if (record) {

            record.PlatformStatisticValue = (Number.parseInt(record.PlatformStatisticValue) + 1).toString();

            await this.psRepository.save(record);

        }
        else {
            record = new PlatformStatistic();
            record.PlatformStatisticType = this.PlatformStatisticType_DataBoardViewCount;
            record.PlatformStatisticKey = dataBoardId;
            record.PlatformStatisticValue = "1";

            await this.psRepository.save(record);
        }
    }
}
