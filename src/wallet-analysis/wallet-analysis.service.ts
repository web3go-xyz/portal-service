import { Inject, Injectable } from '@nestjs/common';
import { ChainType } from 'src/common/entity/ERC20Module/chainType.entity';
import { Between, FindManyOptions, In, Repository } from 'typeorm';
import { WalletAddress } from 'src/common/entity/ERC20Module/walletAddress.entity';
import { RepositoryConsts } from 'src/common/orm/repositoryConsts';

import { WalletAddressInfo } from 'src/common/entity/ERC20Module/walletAddressInfo.entity';

import { WalletAddressTransaction } from 'src/common/entity/ERC20Module/walletAddressTransaction.entity';
import { AddressTag } from 'src/common/entity/CommonModule/addressTag.entity';
import { AddressLabelTypeDef } from 'src/common/label/address.label.def';
import { AddressTagResponse } from 'src/viewModel/chain/AddressTagResponse';
import { ChainListResponse } from 'src/viewModel/chain/chainListResponse';
import { WalletAddressListResponse } from 'src/viewModel/wallet-analysis/walletAddressListResponse';
import { ChainWalletAddressRequest } from 'src/viewModel/wallet-analysis/chainWalletAddressRequest';
import { PageRequest } from 'src/viewModel/base/pageRequest';
import { WalletAddressSimpleInfoRequest } from 'src/viewModel/wallet-analysis/walletAddressSimpleInfoRequest';
import { WalletAddressSimpleInfoResponse } from 'src/viewModel/wallet-analysis/walletAddressSimpleInfoResponse';
import { WalletAddressInfoViewModel } from 'src/viewModel/wallet-analysis/walletAddressInfoViewModel';
import { WalletLabel } from 'src/viewModel/wallet-analysis/walletLabel';
import { WalletAddressTransactionRequest } from 'src/viewModel/wallet-analysis/walletAddressTransactionRequest';
import { WalletAddressTransactionResponse } from 'src/viewModel/wallet-analysis/walletAddressTransactionResponse';
import { LabelDefResponse } from 'src/viewModel/chain/LabelResponse';

@Injectable()
export class WalletAnalysisService {
  constructor(
    @Inject(RepositoryConsts.CHAINTYPE_REPOSITORY)
    private chainTypeRepository: Repository<ChainType>,

    @Inject(RepositoryConsts.WALLET_ADDRESS_REPOSITORY)
    private walletAddressRepository: Repository<WalletAddress>,

    @Inject(RepositoryConsts.WALLET_ADDRESS_INFO_REPOSITORY)
    private wsInfoRepository: Repository<WalletAddressInfo>,

    @Inject(RepositoryConsts.WALLET_ADDRESS_TRANSACTION_REPOSITORY)
    private wsTransactionRepository: Repository<WalletAddressTransaction>,

    @Inject(RepositoryConsts.ADDRESS_TAG_REPOSITORY)
    private addressTagRepository: Repository<AddressTag>,
  ) {}
  async getAddressTagList(request: any): Promise<AddressTagResponse> {
    let resp = new AddressTagResponse();
    let addressTagList = await this.addressTagRepository.find();
    resp.list = addressTagList;
    return resp;
  }
  async getChainList(): Promise<ChainListResponse> {
    let chainTypes = await this.chainTypeRepository.find();
    let resp = new ChainListResponse();
    resp.list = chainTypes;

    return resp;
  }

  async getWalletAddressList(
    request: ChainWalletAddressRequest,
  ): Promise<WalletAddressListResponse> {
    let resp = new WalletAddressListResponse();

    let query = await this.walletAddressRepository.createQueryBuilder('ws');

    query.where('ws.contractAddress=:contractAddress', {
      contractAddress: request.contractAddress,
    });
    if (request.walletAddress) {
      query.andWhere('ws.walletAddress=:walletAddress', {
        walletAddress: request.walletAddress,
      });
    }

    if (request.label) {
      query.leftJoinAndSelect(
        'wallet_address_info',
        'wsi',
        'ws.contractAddress = wsi.contractAddress and ws.walletAddress = wsi.walletAddress',
      );
      query.andWhere("wsi.labels like '%" + request.label + "%'");
    }
    //totalCount

    //get records
    if (request.orderBys != null && request.orderBys.length > 0) {
      query.leftJoinAndSelect(
        'wallet_address_info',
        'wsi2',
        'ws.contractAddress = wsi2.contractAddress and ws.walletAddress = wsi2.walletAddress',
      )
      query.addOrderBy("wsi2." + request.orderBys[0].sort, request.orderBys[0].order);
      query.andWhere("wsi2." + request.orderBys[0].sort + " is not null");
    } 
    else {
      query.addOrderBy('ws.walletAddress', 'ASC');
    }

    query.offset(PageRequest.getSkip(request));
    query.limit(PageRequest.getTake(request));
    query.select(['ws.id', 'ws.walletAddress', 'ws.contractAddress']);
    let ws = await query.getManyAndCount();

    resp.list = ws[0];
    resp.totalCount = ws[1];

    return resp;
  }

  async getWalletAddressSimpleInfo(
    request: WalletAddressSimpleInfoRequest,
  ): Promise<WalletAddressSimpleInfoResponse> {
    let resp = new WalletAddressSimpleInfoResponse();

    let wsInfoList;
    let option = {
      where: {
        contractAddress: request.contractAddress,
        walletAddress: In(request.walletAddressList),
      },
      order: {}
    };
    if (request.orderBy != null) {
      let sort = request.orderBy.sort;
      let order = request.orderBy.order;
      
      if (sort === "balance") {
        option.order["balance"] = order;
      }
      else if (sort === "firstInDate") {
        option.order["firstInDate"] = order;
      }
    }
    else {
      option.order["walletAddress"] = 'ASC';
    }
    wsInfoList = await this.wsInfoRepository.find(option);

    if (wsInfoList) {
      wsInfoList.forEach((t) => {
        let vm = new WalletAddressInfoViewModel();
        vm.id = t.id;
        vm.chainType = t.chainType;
        vm.contractAddress = t.contractAddress;
        vm.walletAddress = t.walletAddress;
        vm.balance = t.balance;
        vm.firstInDate = t.firstInDate;

        var labelsJson = t.labels;
        // console.log('labelsJson：', labelsJson);

        if (labelsJson) {
          var objArray = JSON.parse(labelsJson);

          if (objArray) {
            objArray.forEach((element) => {
              if (element.labelName) {
                let label = new WalletLabel();
                label.labelName = element.labelName;
                label.labelValue = element.labelValue;
                vm.labels.push(label);
              }
            });
          }
        }

        resp.list.push(vm);
      });
    }

    return resp;
  }

  async getWalletAddressTransactionInfo(
    request: WalletAddressTransactionRequest,
  ): Promise<WalletAddressTransactionResponse> {
    let resp = new WalletAddressTransactionResponse();
    let wsTransactionList = await this.wsTransactionRepository.find({
      where: {
        contractAddress: request.contractAddress,
        walletAddress: request.walletAddress,
        transactionTimestamp: Between(
          request.transactionTimestampStart,
          request.transactionTimestampEnd,
        ),
      },
      order: {
        transactionTimestamp: 'ASC',
      },
    });
    resp.list = wsTransactionList;
    return resp;
  }

  getLabelDefs(): LabelDefResponse {
    let resp: LabelDefResponse = {
      list: [
        AddressLabelTypeDef.SHO,
        AddressLabelTypeDef.HB,
        AddressLabelTypeDef.HA,
        AddressLabelTypeDef.SM,
        AddressLabelTypeDef.BW,
        AddressLabelTypeDef.EX,
      ],
    };
    return resp;
  }
}
