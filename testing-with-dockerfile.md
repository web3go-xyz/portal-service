### 1. Pull mysql sample database images from docker and run it
```bash
$ docker pull web3go/mysql-sample-db:milestone1
```
```bash
$ docker run -p 3306:3306 -d --name test-mysql web3go/mysql-sample-db:milestone1
```

### 2. Pull redis image from docker and run it
```bash
$ docker pull redis:latest
```
```bash
$ docker run --name redis-test -p 6379:6379 -d redis --requirepass 123456
```

### 3. Pull portal-service image from docker
```bash
$ docker pull web3go/portal-service:milestone1
```

### 4. Prepare appConfig.js
 
 - Create a appConfig.js file
 - Copy the appConfig.js template (at the bottom of the page) and put it in the appConfig you created
 - Find the host ip address by using command `ifconfig` .
   - `ifconfig` => eth0 => inet => copy the ip address
 - Paste the host ip address in the appConfig.js at the 2 locations indicated below
 - Save the file and note down the path to it

```
Line 25: AppConfig.mysqlConnection = {
            type: 'mysql',
            host: '',  <=========== This needs to be modified
            port: 3306,
            username: 'docker',
            password: '123456',
            synchronize: false,
            logging: false,
        };
```
```
Line 54: AppConfig.redisOption = {
            port: 6379,
            host: '',  <=========== This needs to be modified
            password: '123456',
            db: 0,
        };
```
### 5. Run the portal-service image
```bash
$ docker run -d -p 10000:10000 -v <Path to the appConfig.js>:/app/common/setting/appConfig.js --name my-portal-service web3go/portal-service:milestone1
```

### 6. Visit http://localhost:10000/api to find the api services





## appConfig.js template: 
```
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const TaskType_1 = require("./../task/enum/TaskType");
class AppConfig {
    static initilize() {
        AppConfig.queueOption.queueMap = {};
        AppConfig.queueOption.queueMap[TaskType_1.TaskType.address_activities_analysis] =
            AppConfig.queue_address_activities_analysis;
        AppConfig.queueOption.queueMap[TaskType_1.TaskType.chain_wallet_address_refresh] =
            AppConfig.queue_chain_wallet_address_refresh;
        AppConfig.queueOption.queueMap[TaskType_1.TaskType.polk_para_chains_crowdloan_query] =
            AppConfig.queue_polk_para_chains_crowdloan_query;
        AppConfig.queueOption.queueMap[TaskType_1.TaskType.polk_para_chains_crowdloan_contribution_query] = AppConfig.queue_polk_para_chains_crowdloan_contribution_query;
        AppConfig.queueOption.queueMap[TaskType_1.TaskType.polk_para_chains_crowdloan_contribution_proxy_detail_query] =
            AppConfig.queue_polk_para_chains_crowdloan_contribution_proxy_detail_query;
        AppConfig.queueOption.queueMap[TaskType_1.TaskType.karura_CDP_refresh] =
            AppConfig.queue_karura_CDP_refresh;
        console.log(AppConfig);
    }
}
exports.AppConfig = AppConfig;
_a = AppConfig;
AppConfig.mysqlConnection = {
    type: 'mysql',
    // host: '172.17.0.1',
    host: '172.30.78.184',
    port: 3306,
    username: 'docker',
    password: '123456',
    synchronize: false,
    logging: false,
};
AppConfig.postgresConnection = {
    type: 'postgres',
    host: '',
    port: 5432,
    username: 'postgres',
    password: '',
    synchronize: false,
    logging: false,
};
AppConfig.typeOrmOptionPlatform = Object.assign(Object.assign({}, _a.mysqlConnection), { database: 'ido-platform' });
AppConfig.typeOrmOptionErc20 = Object.assign(Object.assign({}, _a.mysqlConnection), { database: 'ido-erc20' });
AppConfig.typeOrmOption4PolkadotParaChain = Object.assign(Object.assign({}, _a.mysqlConnection), { database: 'ido-polkadot' });
AppConfig.typeOrmOption4KusamaParaChain = Object.assign(Object.assign({}, _a.mysqlConnection), { database: 'ido-kusama-crowdloan' });
AppConfig.typeOrmOption4CDPDB = Object.assign(Object.assign({}, _a.mysqlConnection), { database: 'ido-price' });
AppConfig.typeOrmOption4MoonRiverDB = Object.assign(Object.assign({}, _a.mysqlConnection), { database: 'ido-moonriver' });
AppConfig.typeOrmOption4RMRKDB = Object.assign(Object.assign({}, _a.postgresConnection), { database: 'dev-rmrk' });
AppConfig.typeOrmOption4PolkadotBalanceDB = Object.assign(Object.assign({}, _a.postgresConnection), { database: 'dev-polkadot' });
AppConfig.typeOrmOption4PIS = Object.assign(Object.assign({}, _a.postgresConnection), { database: 'dev-pis' });
AppConfig.typeOrmOption4MoonbeamBalanceDB = Object.assign(Object.assign({}, _a.postgresConnection), { database: 'dev-moonbeam-balance' });
AppConfig.typeOrmOption4MoonriverBalanceDB = Object.assign(Object.assign({}, _a.postgresConnection), { database: 'dev-moonriver-balance' });
AppConfig.redisOption = {
    port: 6379,
    // host: '172.17.0.1',
    host: '172.30.78.184',
    password: '123456',
    db: 0,
};
AppConfig.taskServerOption = {
    reportResultEndPoint: 'http://localhost:10001/task/task/reportResult',
    reportStatusEndPoint: 'http://localhost:10001/task/task/reportStatus',
};
AppConfig.scheduleOption = {
    walletAddressRefreshIntervalCron: {
        cron: '0 0 */3 * * *',
        enable: false,
    },
    balanceTransactionsRefreshIntervalCron: {
        cron: '0 0 */3 * * *',
        enable: false,
    },
    kusama_polkParaChainRefreshIntervalCron: {
        cron: '0 */2 * * * *',
        enable: false,
    },
    polkadot_polkParaChainRefreshIntervalCron: {
        cron: '0 */2 * * * *',
        enable: false,
    },
    polkadot_polkParaChainCrowdloanContributionOnParallelProxyDetailRefreshIntervalCron: {
        cron: '0 */2 * * * *',
        enable: false,
    },
    polkadot_polkParaChainCrowdloanContributionOnBifrostProxyDetailRefreshIntervalCron: {
        cron: '0 */2 * * * *',
        enable: false,
    },
    karuraCDPRefreshIntervalCron: {
        cron: '0 0 */2 * * *',
        enable: false,
    },
};
AppConfig.queueOption = {
    uiEnable: true,
    basePath: '/admin/queues',
    removeOnComplete: 9999,
    queueMap: {},
};
AppConfig.queue_address_activities_analysis = 'address_activities_analysis';
AppConfig.queue_chain_wallet_address_refresh = 'chain_wallet_address_refresh';
AppConfig.queue_polk_para_chains_crowdloan_query = 'polk_para_chains_crowdloan_query';
AppConfig.queue_polk_para_chains_crowdloan_contribution_query = 'polk_para_chains_crowdloan_contribution_query';
AppConfig.queue_polk_para_chains_crowdloan_contribution_proxy_detail_query = 'polk_para_chains_crowdloan_contribution_proxy_detail_query';
AppConfig.queue_karura_CDP_refresh = 'karura_CDP_refresh';
AppConfig.queue_address_activities_analysis_concurrency = 5;
AppConfig.queue_chain_wallet_address_refresh_concurrency = 5;
AppConfig.queue_polk_para_chains_crowdloan_query_concurrency = 1;
AppConfig.queue_polk_para_chains_crowdloan_contribution_query_concurrency = 3;
AppConfig.queue_polk_para_chains_crowdloan_contribution_proxy_detail_query_concurrency = 1;
AppConfig.queue_karura_CDP_refresh_concurrency = 1;
AppConfig.START_TIMESTAMP = 1230739200;
AppConfig.kusamaCrowdloanDataSourceApiUrl = 'https://api.subquery.network/sq/subvis-io/kusama-auction';
AppConfig.polkadotCrowdloanDataSourceApiUrl = 'https://api.subquery.network/sq/bianyunjian/polkadot-crowdloans';
AppConfig.polkadotCrowdloanParallelIndexerUrl = 'https://api.subquery.network/sq/parallel-finance/auction-subquery';
AppConfig.polkadotCrowdloanBifrostIndexerUrl = 'https://bifrost-service.bifrost.finance/polkadot-subql';
AppConfig.karuraCDPDataSourceApiUrl = 'https://api.subquery.network/sq/AcalaNetwork/karura';
AppConfig.moonRiverDataSourceApiUrl = 'https://api.subquery.network/sq/bianyunjian/moonriver-staking-indexer';
AppConfig.erc20DataSourceApiUrl = 'https://api.thegraph.com/subgraphs/name/moehringen/erc20indexer';
//# sourceMappingURL=appConfig.js.map
```