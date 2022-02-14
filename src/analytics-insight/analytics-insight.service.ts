import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MyLogger } from 'src/common/log/logger.service';
import { FindManyOptions, In, Repository } from 'typeorm';
import { RepositoryConsts } from 'src/common/orm/repositoryConsts';
import { AnalyticsInsightDashboard } from 'src/common/entity/CustomQueryModule/AnalyticsInsightDashboard.entity';
import { PublishDataBoardRequest, PublishDataBoardResponse } from 'src/viewModel/analytics-insight/PublishDataBoard';
import { RemoveDataBoardRequest, RemoveDataBoardResponse } from 'src/viewModel/analytics-insight/RemoveDataBoard';
import { QueryDataBoardListRequest, QueryDataBoardListResponse } from 'src/viewModel/analytics-insight/QueryDataBoardList';
import { PageRequest } from 'src/viewModel/base/pageRequest';
@Injectable()
export class AnalyticsInsightService {

    logger: MyLogger;

    constructor(
        @Inject(RepositoryConsts.ANALYTICS_INSIGHT_DASHBOARD_REPOSITORY)
        private repository: Repository<AnalyticsInsightDashboard>,
    ) {
        this.logger = new MyLogger('AnalyticsInsightService');
    }

    async queryDataBoardList
        (request: QueryDataBoardListRequest): Promise<QueryDataBoardListResponse> {

        let filter: FindManyOptions<AnalyticsInsightDashboard> = {
            skip: PageRequest.getSkip(request),
            take: PageRequest.getTake(request),
            order: {
                created_timestamp: 'DESC'
            }
        };
        if (request.id_filter && request.id_filter.length > 0) {
            filter.where = {
                id: In(request.id_filter)
            }
        }
        let rawData = await this.repository.findAndCount(filter);

        return {
            list: rawData[0],
            totalCount: rawData[1]
        }
    }
    async removeDashboard(request: RemoveDataBoardRequest): Promise<RemoveDataBoardResponse> {
        let record = await this.repository.findOne({
            id: request.id
        });
        if (record) {
            await this.repository.remove(record);
            return { ...record };
        }
        this.logger.error(`dashboard id ${request.id} not exist`);
        throw new BadRequestException(`dashboard id ${request.id} not exist`);
    }
    async publishDashboard(request: PublishDataBoardRequest): Promise<PublishDataBoardResponse> {
        if (request.id) {
            //update
            let record = await this.repository.findOne({
                id: request.id
            });
            if (record) {
                Object.assign(record, request);
                await this.repository.save(record);
                return { ...record };
            }
        }

        //check name duplicate before created
        let findDuplicateRecord = await this.repository.findOne({
            where: {
                dashboard_id: request.dashboard_id,
                name: request.name
            }
        })
        if (findDuplicateRecord) {
            throw new BadRequestException('duplicate dashboard_id and name found, please check.');
        }
        // new created
        let newRecord: AnalyticsInsightDashboard = new AnalyticsInsightDashboard();
        Object.assign(newRecord, request);
        await this.repository.save(newRecord);
        return { ...newRecord };
    }

}
