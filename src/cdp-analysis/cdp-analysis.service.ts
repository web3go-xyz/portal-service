import { Inject, Injectable } from '@nestjs/common';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { RepositoryConsts } from 'src/common/orm/repositoryConsts';

import { PageRequest } from 'src/viewModel/base/pageRequest';
import { ChainState } from 'src/common/entity/CDPModule/chainState.entity';
import { Price } from 'src/common/entity/CDPModule/price.entity';
import { ChainStatistic } from 'src/common/entity/CDPModule/chainStatistic.entity';
import { LoanPosition } from 'src/common/entity/CDPModule/loanPosition.entity';
import { LoanAction } from 'src/common/entity/CDPModule/loanAction.entity';
import { CDPLoanPositionRequest } from 'src/viewModel/cdp/CDPLoanPositionRequest';
import { CDPLoanPositionResponse } from 'src/viewModel/cdp/CDPLoanPositionResponse';
import { CDChainStatisticResponse } from 'src/viewModel/cdp/CDChainStatisticResponse';
import { CDPLoanPositionStatisticResponse } from 'src/viewModel/cdp/CDPLoanPositionStatisticResponse';
import { CDPLoanActionRequest } from 'src/viewModel/cdp/CDPLoanActionRequest';
import { CDPLoanActionResponse } from 'src/viewModel/cdp/CDPLoanActionResponse';
import { MyLogger } from 'src/common/log/logger.service';
import { CDPLoanActionKlineRequest } from 'src/viewModel/cdp/CDPLoanActionKlineRequest';
import {
  CDPLoanActionKlineItem,
  CDPLoanActionKlineResponse,
} from '../viewModel/cdp/CDPLoanActionKlineResponse';
import { CDPRule } from 'src/common/cdp/cdpRule';
import { CDPPriceKeeper } from 'src/common/cdp/cdpPriceKeeper';
import { KVService } from 'src/common/kv/kv.service';
@Injectable()
export class CDPAnalysisService {
  static CDP_RULE_INSTANCE: CDPRule;
  CDP_KARURA: string = 'Karura';
  constructor(
    @Inject(RepositoryConsts.CDP_CHAIN_STATE_REPOSITORY)
    private cdpChainStateRepository: Repository<ChainState>,
    @Inject(RepositoryConsts.CDP_PRICE_REPOSITORY)
    private cdpPriceRepository: Repository<Price>,

    @Inject(RepositoryConsts.CDP_CHAIN_STATISTIC_REPOSITORY)
    private cdpChainStatisticRepository: Repository<ChainStatistic>,
    @Inject(RepositoryConsts.CDP_LOAN_POSITION_REPOSITORY)
    private cdpLoanPositionRepository: Repository<LoanPosition>,
    @Inject(RepositoryConsts.CDP_LOAN_ACTION_REPOSITORY)
    private cdpLoanActionRepository: Repository<LoanAction>,

    private kvService: KVService,
  ) {
    CDPPriceKeeper.setDataRepository(cdpPriceRepository);
  }

  async getCDPRule(): Promise<CDPRule> {
    if (CDPAnalysisService.CDP_RULE_INSTANCE == null) {
      let chainState = await this.getChainState(this.CDP_KARURA, 'KSM');
      let cdpRule = new CDPRule(
        chainState.requiredCollateralRatioPercentage,
        chainState.liquidationRatioPercentage,
        chainState.liquidationPenaltyPercentage,
      );
      CDPAnalysisService.CDP_RULE_INSTANCE = cdpRule;
    }
    return CDPAnalysisService.CDP_RULE_INSTANCE;
  }

  async getChainState(chain: string, symbol: string): Promise<ChainState> {
    let record = await this.cdpChainStateRepository.findOne({
      where: {
        chain: chain,
        symbol: symbol,
      },
    });
    return record;
  }
  async getChainStatistic(
    chain: string,
    symbol: string,
  ): Promise<CDChainStatisticResponse> {
    let record = await this.cdpChainStatisticRepository.findOne({
      where: {
        chain: chain,
        tokenId: symbol,
      },
    });
    let resp = new CDChainStatisticResponse();
    for (let k in record) {
      resp[k] = record[k];
    }

    let sql = `
          SELECT
            sum( debitFormat ) as debitFormat,
            sum( collateralFormat )  as collateralFormat
          FROM
            loan_position
            where chain='${record.chain}' and tokenId='${record.tokenId}';
    `;
    const rawData = await this.cdpChainStatisticRepository.query(sql);
    if (rawData) {
      for (const row of rawData) {
        resp.debitFormat = row.debitFormat;
        resp.collateralFormat = row.collateralFormat;
      }
    }
    return resp;
  }

  async getLoanPositionList(
    request: CDPLoanPositionRequest,
  ): Promise<CDPLoanPositionResponse> {
    let resp = new CDPLoanPositionResponse();

    let query = await this.cdpLoanPositionRepository.createQueryBuilder('lp');

    if (request.chain) {
      query.andWhere('lp.chain=:chain', {
        chain: request.chain,
      });
    }
    if (request.symbol) {
      query.andWhere('lp.tokenId=:tokenId', {
        tokenId: request.symbol,
      });
    }
    if (request.accountId) {
      query.andWhere('lp.accountId=:accountId', {
        accountId: request.accountId,
      });
    }
    if (request.filterStatus && request.filterStatus.length > 0) {
      let statusCondition = '';
      request.filterStatus.forEach((s) => {
        if (statusCondition) {
          statusCondition += ',';
        }
        statusCondition += "'" + s + "'";
      });
      query.andWhere('lp.status in (' + statusCondition + ')');
    }
    if (request.hideLoanCompleted) {
      query.andWhere('lp.collateral > 0 ');
    }

    if (request.orderBys && request.orderBys.length > 0) {
      request.orderBys.forEach((d) => {
        query.addOrderBy('lp.' + d.sort, d.order);
      });
    }
    //get records
    query.offset(PageRequest.getSkip(request));
    query.limit(PageRequest.getTake(request));

    let data = await query.getManyAndCount();

    // console.log(data);

    resp.list = data[0];
    resp.totalCount = data[1];

    return resp;
  }

  async getLoanActionList(
    request: CDPLoanActionRequest,
  ): Promise<CDPLoanActionResponse> {
    let selectFields = [
      'id',
      'chain',
      'tokenId',
      'accountId',
      'actionId',
      'type',
      'subType',
      'timestamp',
      ,
      'debitAdjustment',
      'debit',
      'collateralAdjustment',
      'collateral',
      'debitFormat',
      'collateralFormat',
      'collateralPrice',
      'ratioPercentage',
      'status',
      'debitAdjustment_balance',
      'collateralAdjustment_balance',
      'blockNumber',
      'blockId',
      'extrinsicId',
    ];

    // MyLogger.log(selectFields);
    let options: FindManyOptions = {
      where: {
        chain: request.chain,
        tokenId: request.symbol,
        accountId: request.accountId,
      },
      skip: PageRequest.getSkip(request),
      take: PageRequest.getTake(request),
      select: selectFields,
    };
    if (request.orderBys && request.orderBys.length > 0) {
      options.order = {};
      request.orderBys.forEach((d) => (options.order[d.sort] = d.order));
    } else {
      options.order = {
        timestamp: 'DESC',
      };
    }

    let result = await this.cdpLoanActionRepository.findAndCount(options);

    let resp = new CDPLoanActionResponse();
    resp.totalCount = result[1];
    resp.list = result[0];

    return resp;
  }

  async getLoanPositionStatistic(
    request: CDPLoanPositionRequest,
  ): Promise<CDPLoanPositionStatisticResponse> {
    console.log('getLoanPositionStatistic for account:', request);

    let resp = new CDPLoanPositionStatisticResponse();

    //get all actions here
    let selectFields = [
      'actionId',
      'type',
      'timestamp',
      'debitAdjustment',
      'debit',
      'collateralAdjustment',
      'collateral',
      'debitFormat',
      'collateralFormat',
      'collateralPrice',
    ];

    let options: FindManyOptions = {
      where: {
        chain: request.chain,
        tokenId: request.symbol,
        accountId: request.accountId,
      },
      select: selectFields,
      order: {
        timestamp: 'ASC',
      },
    };
    let loanActions = await this.cdpLoanActionRepository.find(options);

    resp.valueInvested = 0;
    resp.valueWithdraw = 0;
    resp.cdpBalance = 0;
    if (loanActions && loanActions.length > 0) {
      //do the calculation of each item.
      loanActions.forEach((la) => {
        let collateralChanged =
          CDPRule.formatCollateral(la.collateralAdjustment) *
          la.collateralPrice;
        let debitChanged = CDPRule.formatDebit(la.debitAdjustment);
        console.log(
          'timestamp',
          la.timestamp,
          ',collateralChanged:',
          collateralChanged,
          ',debitChanged:',
          debitChanged,
        );

        if (collateralChanged > 0) {
          resp.valueInvested += collateralChanged;
        } else {
          resp.valueWithdraw += -1 * collateralChanged;
        }

        if (debitChanged > 0) {
          resp.valueWithdraw += debitChanged;
        } else {
          resp.valueInvested += -1 * debitChanged;
        }
      });

      let lastLoanAction = loanActions[loanActions.length - 1];
      resp.cdpBalance =
        CDPRule.formatCollateral(lastLoanAction.collateral) *
          lastLoanAction.collateralPrice -
        CDPRule.formatDebit(lastLoanAction.debit);
    }
    resp.lifetimeProfit =
      resp.cdpBalance + resp.valueWithdraw - resp.valueInvested;

    MyLogger.log('getLoanPositionStatistic result:' + JSON.stringify(resp));

    return resp;
  }
  async getLoanActionKline(
    request: CDPLoanActionKlineRequest,
  ): Promise<CDPLoanActionKlineResponse> {
    let resp = new CDPLoanActionKlineResponse();
    //TODO use a background job to generate the kline data by period , and save the data into Redis to improve the query performance.
    // The data is no need to save since it can be generated and updated by a fixed time interval.

    //get all actions from database
    console.log('getLoanActionKline for account:', request);

    //check cache

    let cacheKey: string =
      'kline_' + request.accountId + '_' + request.timeInterval + '_';
    cacheKey += CDPPriceKeeper.formatTimeInterval(
      request.startTime,
      request.timeInterval,
    ).toString();
    cacheKey += '_';
    cacheKey += CDPPriceKeeper.formatTimeInterval(
      request.endTime,
      request.timeInterval,
    ).toString();
    console.log('kline cachekey:', cacheKey);

    let cacheData = await this.kvService.get(cacheKey);
    if (cacheData) {
      MyLogger.log('kline cache hit for account:' + request.accountId);
      return cacheData as unknown as CDPLoanActionKlineResponse;
    }

    //get all actions here
    let selectFields = [
      'actionId',
      'type',
      'timestamp',
      'debitAdjustment',
      'debit',
      'collateralAdjustment',
      'collateral',
      'debitFormat',
      'collateralFormat',
      'collateralPrice',
    ];

    let options: FindManyOptions = {
      where: {
        chain: request.chain,
        tokenId: request.symbol,
        accountId: request.accountId,
        timestamp: Between(request.startTime, request.endTime),
      },
      select: selectFields,
      order: {
        timestamp: 'ASC',
      },
    };
    let loanActions = await this.cdpLoanActionRepository.find(options);
    if (!loanActions || loanActions.length == 0) {
      return resp;
    }

    //get price range
    console.log('actual_startTimeFormated:', loanActions[0].timestamp);
    let actual_startTime = loanActions[0].timestamp;
    console.log('actual_endTime:', request.endTime);
    let actual_endTime = request.endTime;
    let priceRange = await CDPPriceKeeper.getPriceRange(
      actual_startTime,
      actual_endTime,
    );

    //add more records from startTime to endTime by the timeInterval

    let formatedLoanActions = {};
    for (let dataIndex = 0; dataIndex < loanActions.length; dataIndex++) {
      const timestamp = loanActions[dataIndex].timestamp;

      let timeIndicator = CDPPriceKeeper.formatTimeInterval(
        timestamp,
        request.timeInterval,
      );
      // console.log('formatedLoanActions timestamp:', timestamp, ',timeIndicator:', timeIndicator);

      if (formatedLoanActions[timeIndicator] == undefined) {
        formatedLoanActions[timeIndicator] = [];
      }
      formatedLoanActions[timeIndicator].push(loanActions[dataIndex]);
    }

    let currentTimeIndicator = CDPPriceKeeper.formatTimeInterval(
      actual_startTime,
      request.timeInterval,
    );
    console.log(
      'currentTimeIndicator:',
      currentTimeIndicator,
      ',actual_startTime:',
      actual_startTime,
    );

    let timeInterval = CDPPriceKeeper.getTimeIntervalValue(
      request.timeInterval,
    );
    let lastRecord: LoanAction;
    let klines: CDPLoanActionKlineItem[] = [];
    let dataIndex = 0;
    while (currentTimeIndicator < actual_endTime) {
      //console.log('dataIndex:', dataIndex, ',currentTimeIndicator:', currentTimeIndicator);

      //find if has any loanAction with  currentTimeIndicator,
      //if yes , add these records into result,
      //otherwise, add a simple record
      if (formatedLoanActions[currentTimeIndicator]) {
        let findRecords = formatedLoanActions[
          currentTimeIndicator
        ] as LoanAction[];
        for (let index = 0; index < findRecords.length; index++) {
          let la = findRecords[index];
          let newItem = new CDPLoanActionKlineItem();
          newItem.timestamp = la.timestamp;
          newItem.collateralAdjustmentFormat = CDPRule.formatCollateral(
            la.collateralAdjustment,
          );
          newItem.collateralFormat = la.collateralFormat;
          newItem.debitAdjustmentFormat = CDPRule.formatDebit(
            la.debitAdjustment,
          );
          newItem.debitFormat = la.debitFormat;
          newItem.status = la.status;
          newItem.ratioPercentage = la.ratioPercentage;
          newItem.collateralPrice = la.collateralPrice;
          klines.push(newItem);
          dataIndex++;
        }
        lastRecord = findRecords[findRecords.length - 1];
      } else {
        if (lastRecord) {
          if (lastRecord.collateral > 0) {
            let newItem = new CDPLoanActionKlineItem();
            newItem.timestamp = currentTimeIndicator;
            newItem.collateralAdjustmentFormat = 0;
            newItem.collateralFormat = lastRecord.collateralFormat;
            newItem.debitAdjustmentFormat = 0;
            newItem.debitFormat = lastRecord.debitFormat;

            //use the price at moment
            if (priceRange[currentTimeIndicator]) {
              newItem.collateralPrice = priceRange[currentTimeIndicator];
            } else {
              newItem.collateralPrice = priceRange[priceRange.length - 1];
              //newItem.collateralPrice = lastRecord.collateralPrice;
            }
            let cdpRule = await this.getCDPRule();
            newItem.ratioPercentage = cdpRule.getLoanRatioPercentage(
              lastRecord.collateral,
              newItem.collateralPrice,
              lastRecord.debit,
            );
            newItem.status = cdpRule.getLoanStatus(newItem.ratioPercentage);
            klines.push(newItem);
            dataIndex++;
          }
        }
      }

      currentTimeIndicator += timeInterval;
    }

    resp.totalCount = klines.length;
    resp.list = klines;

    MyLogger.log('getLoanActionKline result with length:' + resp.totalCount);

    //set cache
    if (resp.totalCount > 0) {
      this.kvService.set(cacheKey, JSON.stringify(resp));
    }
    return resp;
  }
}
