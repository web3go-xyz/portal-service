import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

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
import { Accounts as MoonBeamBalanceAccounts } from 'src/common/entity/MoonbeamBalanceModule/Accounts';

@Injectable()
export class CustomQueryService {

  constructor(

    @Inject(RepositoryConsts.DATABASE_CONNECTION)
    private mysql_mainConnection: Connection,

    @Inject(RepositoryConsts.CUSTOM_QUERY_REPOSITORY)
    private cqRepository: Repository<CustomQuery>,

    @Inject(RepositoryConsts.WALLET_ADDRESS_REPOSITORY)
    private idoErc20Repository: Repository<WalletAddress>,

    @Inject(RepositoryConsts.CDP_CHAIN_STATE_REPOSITORY)
    private idoPriceRepository: Repository<ChainState>,

    @Inject(RepositoryConsts.MOONRIVER_CHAIN_STATE_REPOSITORY)
    private idoMoonriverStakingRepository: Repository<MoonRiverChainState>,


    @Inject(RepositoryConsts.KUSAMA_PARA_CHAIN_REPOSITORY)
    private idoKusamaCrowdloanRepository: Repository<PolkParaChain>,

    @Inject(RepositoryConsts.POLKADOT_PARA_CHAIN_REPOSITORY)
    private idoPolkadotCrowdloanRepository: Repository<PolkParaChain>,

    @Inject(RepositoryConsts.MOONBEAM_BALANCE_ACCOUNT_REPOSITORY)
    private moonbeamBalanceRepository: Repository<MoonBeamBalanceAccounts>,

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
    if (schema == 'ido-polkadot-crowdloan') {
      return this.idoPolkadotCrowdloanRepository;
    }
    if (schema == 'ido-karura-cdp') {
      return this.idoPriceRepository;
    }
    if (schema == 'ido-moonriver-staking') {
      return this.idoMoonriverStakingRepository;
    }
 
    if (schema == 'prod-moonbeam-balance') {
      return this.moonbeamBalanceRepository;
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

  }


  async getTables(request: CustomQueryDataTableRequest): Promise<DataTable[]> {

    let db_type = 'mysql';
    if (request.schema.startsWith('ido')) {
      db_type = 'mysql'
    }
    else {
      db_type = 'postgresql'
    }
    if (db_type == 'mysql') {
      return this.getTables4MySQL(request);
    }

    if (db_type == 'postgresql') {
      return this.getTables4Postgresql(request);
    }
  }

  async getTables4MySQL(request: CustomQueryDataTableRequest): Promise<DataTable[]> {

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
    const rawData = await this.mysql_mainConnection.query(queryExpression);

    let resp: DataTable[] = [];
    if (rawData) {
      for (let index = 0; index < rawData.length; index++) {
        const d = rawData[index];
        let columns = await this.getTableColumns4MySQL(request.schema, d.TABLE_NAME);
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

  async getTableColumns4MySQL(schema: string, tableName: string): Promise<DataTableColumn[]> {

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
    const rawData = await this.mysql_mainConnection.query(queryExpression);

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

  async getTables4Postgresql(request: CustomQueryDataTableRequest): Promise<DataTable[]> {

    let db = this.getDbRepository(request.schema);

    let queryExpression = ` SELECT tablename FROM pg_tables where schemaname='public' `;

    if (request.filterTableNames && request.filterTableNames.length > 0) {
      let inCondition = '';
      for (let index = 0; index < request.filterTableNames.length; index++) {
        const filterName = request.filterTableNames[index];
        if (inCondition.length > 0) { inCondition += ","; }
        inCondition += "'" + filterName + "'";
      }
      queryExpression += ` AND tablename in( ${inCondition}) `;
    }
    queryExpression += ` ORDER BY tablename; `;
    const rawData = await db.query(queryExpression);

    let resp: DataTable[] = [];
    if (rawData) {
      for (let index = 0; index < rawData.length; index++) {
        const d = rawData[index];
        let columns = await this.getTableColumns4Postgresql(request.schema, d.tablename);
        resp.push({
          schema: request.schema,
          tableComment: '',
          tableName: d.tablename,
          columns: columns
        })
      }
    }
    return resp;
  }

  async getTableColumns4Postgresql(schema: string, tableName: string): Promise<DataTableColumn[]> {
    let db = this.getDbRepository(schema);

    let queryExpression = `
                          SELECT A
                            .attnum,
                            A.attname AS field,
                            T.typname AS field_type,
                            A.attlen AS LENGTH,
                            A.atttypmod AS lengthvar,
                            A.attnotnull AS NOTNULL,
                            b.description AS field_comment 
                          FROM
                            pg_class C,
                            pg_attribute
                            A LEFT OUTER JOIN pg_description b ON A.attrelid = b.objoid 
                            AND A.attnum = b.objsubid,
                            pg_type T 
                          WHERE
                            C.relname = '${tableName}' 
                            AND A.attnum > 0 
                            AND A.attrelid = C.oid 
                            AND A.atttypid = T.oid 
                          ORDER BY
                            A.attnum;`;
    const rawData = await db.query(queryExpression);

    let resp: DataTableColumn[] = [];
    if (rawData) {
      rawData.forEach(d => {
        resp.push({
          columnName: d.field,
          columnComment: d.field_comment,
          dataType: d.field_type
        })
      });
    }
    return resp;
  }
}
