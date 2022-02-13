import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RepositoryConsts } from 'src/common/orm/repositoryConsts';
import { CustomQuery } from 'src/common/entity/CustomQueryModule/customQuery.entity';
import { CustomQueryExecuteRequest } from 'src/viewModel/custom-query/CustomQueryExecuteRequest';
import { CustomQueryDataTableRequest } from 'src/viewModel/custom-query/CustomQueryDataTableRequest';
import { DataTable } from '../viewModel/custom-query/DataTable';
import { DataTableColumn } from 'src/viewModel/custom-query/DataTableColumn';
import { ChainState } from 'src/common/entity/CDPModule/chainState.entity';
import { PolkParaChain } from 'src/common/entity/PolkParaChainModule/polkParaChain.entity';
import { MoonRiverChainState } from 'src/common/entity/MoonRiverModule/MoonRiverChainState.entity';
import { WalletAddress } from 'src/common/entity/ERC20Module/walletAddress.entity';

@Injectable()
export class CustomQueryService {

  constructor(
    @Inject(RepositoryConsts.CUSTOM_QUERY_REPOSITORY)
    private cqRepository: Repository<CustomQuery>,

    @Inject(RepositoryConsts.WALLET_ADDRESS_REPOSITORY)
    private idoErc20Repository: Repository<WalletAddress>,
    
    @Inject(RepositoryConsts.CDP_CHAIN_STATE_REPOSITORY)
    private idoPriceRepository: Repository<ChainState>,

    @Inject(RepositoryConsts.MOONRIVER_CHAIN_STATE_REPOSITORY)
    private idoMoonriverRepository: Repository<MoonRiverChainState>,


    @Inject(RepositoryConsts.KUSAMA_PARA_CHAIN_REPOSITORY)
    private idoKusamaCrowdloanRepository: Repository<PolkParaChain>,
    
    @Inject(RepositoryConsts.POLKADOT_PARA_CHAIN_REPOSITORY)
    private idoPolkadotCrowdloanRepository: Repository<PolkParaChain>,


  ) { }

  async getList(): Promise<CustomQuery[]> {
    let records = await this.cqRepository.find({
      order: {
        createdTimestamp: "ASC"
      }
    });
    if (records && records.length > 0) {
      for (let index = 0; index < records.length; index++) {
        const record = records[index];
        record["tags"] = ["CustomQuery", "Community"];
        let schemaType = 'ERC20';
        let params = record.params;
        if (params) {
          let json = JSON.parse(params);
          console.log(json);

          let schemaOption = json.schemaOption;
          if (schemaOption) {
            schemaType = schemaOption.schemaType;
          }
        }
        record["tags"].push(schemaType);
      }

    }
    return records;
  }

  async getDetail(id: number): Promise<CustomQuery> {
    let record = await this.cqRepository.findOne({
      where: { id: id },
    });
    return record;
  }

  async remove(id: number): Promise<CustomQuery> {
    let record = await this.cqRepository.findOne({
      where: { id: id },
    });
    if (record) {
      return await this.cqRepository.remove(record);
    }
  }
  async create(request: CustomQuery): Promise<CustomQuery> {
    let record = await this.cqRepository.save(request);
    return record;
  }
  async update(request: CustomQuery): Promise<CustomQuery> {
    let record = await this.cqRepository.findOne({
      where: { id: request.id },
    });
    if (record) {
      request.id = record.id;
      return await this.cqRepository.save(request);
    }
  }

  async executeQuery(request: CustomQueryExecuteRequest): Promise<any> {

    let queryExpression: string = this.buildQueryExpression(request);
    console.log('build expression:', queryExpression);

    if (queryExpression) {
      //query 
      let repository = this.getDbRepository(request.schema);
      try {
        const rawData = await repository.query(queryExpression);
        return { errorCode: 0, data: rawData };
      } catch (error) {
        console.log("query error:", error);
        return {
          errorCode: error.errno,
          errorMessage: error.sqlMessage,
          data: null
        };
      }

    } else {
      throw new BadRequestException('invalid query');
    }

  }
  getDbRepository(schema: string): Repository<any> {
    if (schema == 'ido-erc20') {
      return this.idoErc20Repository;
    }
    if (schema == 'ido-kusama-crowdloan') {
      return this.idoKusamaCrowdloanRepository;
    }
    if (schema == 'ido-price') {
      return this.idoPriceRepository;
    }
    if (schema == 'ido-moonriver') {
      return this.idoMoonriverRepository;
    }
    if (schema == 'ido-polkadot') {
      return this.idoPolkadotCrowdloanRepository;
    }
  }
  buildQueryExpression(request: CustomQueryExecuteRequest): string {
    let filterKeyWord = ['update ', 'delete ', 'alter ', 'drop ', 'create ', 'insert '];
    if (request.queryExpression) {
      for (let index = 0; index < filterKeyWord.length; index++) {
        const fw = filterKeyWord[index];
        if (request.queryExpression.indexOf(fw) >= 0 || request.queryExpression.indexOf(fw.toUpperCase()) >= 0) {
          throw new BadRequestException('invalid query expression');
        }
      }
      request.queryExpression = request.queryExpression.replace(/;/g, '');
      return "SELECT * FROM ( " + request.queryExpression + " ) wrapper LIMIT 1000 ";
    }


    let expression = " SELECT ";
    if (request.selectedFields && request.selectedFields.length > 0) {
      expression += request.selectedFields.join(",");
    }
    else {
      expression += " * ";
    }
    expression += " FROM ";
    expression += " wallet_address_info d  ";
    if (request.selectedToken) {
      expression += " WHERE d.contractAddress='" + request.selectedToken + "'";
    }

    if (request.orderByFields) {
      expression += " ORDER BY " + request.orderByFields;
    }
    if (!request.recordCount) {
      request.recordCount = '1000';
    }
    if (request.recordCount) {
      expression += " LIMIT " + request.recordCount;
    }

    return expression;

  }


  async getTables(request: CustomQueryDataTableRequest): Promise<DataTable[]> {

    let queryExpression = ` SELECT
                              TABLE_NAME,
                              TABLE_COMMENT 
                            FROM
                              information_schema.\`TABLES\` 
                            WHERE
                              table_schema = '${request.schema}'  `;

    if (request.filterTableNames && request.filterTableNames.length > 0) {
      let inCondition = '';
      for (let index = 0; index < request.filterTableNames.length; index++) {
        const filterName = request.filterTableNames[index];
        if (inCondition.length > 0) { inCondition += ","; }
        inCondition += "'" + filterName + "'";
      }
      queryExpression += ` AND table_name in( ${inCondition}) `;
    }
    queryExpression += ` ORDER BY TABLE_NAME; `;
    const rawData = await this.cqRepository.query(queryExpression);

    let resp: DataTable[] = [];
    if (rawData) {
      for (let index = 0; index < rawData.length; index++) {
        const d = rawData[index];
        let columns = await this.getTableColumns(request.schema, d.TABLE_NAME);
        resp.push({
          schema: request.schema,
          tableComment: d.TABLE_COMMENT,
          tableName: d.TABLE_NAME,
          columns: columns
        })
      }
    }
    return resp;
  }

  async getTableColumns(schema: string, tableName: string): Promise<DataTableColumn[]> {

    let queryExpression = `SELECT
                              COLUMN_NAME,
                              DATA_TYPE,
                              COLUMN_COMMENT 
                            FROM
                              information_schema.\`COLUMNS\` 
                            WHERE
                              table_schema = '${schema}'   
                              AND table_name = '${tableName}'   
                            ORDER BY
                            COLUMN_NAME`;
    const rawData = await this.cqRepository.query(queryExpression);

    let resp: DataTableColumn[] = [];
    if (rawData) {
      rawData.forEach(d => {
        resp.push({
          columnName: d.COLUMN_NAME,
          columnComment: d.COLUMN_COMMENT,
          dataType: d.DATA_TYPE
        })
      });
    }
    return resp;
  }
}
