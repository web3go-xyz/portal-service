import { Inject, Injectable } from '@nestjs/common';
import { Between, FindManyOptions, In, Repository } from 'typeorm';
import { LabelMarkConfig } from 'src/common/entity/ERC20Module/labelMarkConfig.entity';

import { WalletLabelConfig } from 'src/common/label/wallet-label/walletLabelConfig';
import { RepositoryConsts } from 'src/common/orm/repositoryConsts';
import { AddressTagResponse } from 'src/viewModel/chain/AddressTagResponse';
import { AddressTag } from 'src/common/entity/CommonModule/addressTag.entity';

@Injectable()
export class ConfigManageService {
  async removeAddressTag(request: AddressTag): Promise<boolean> {
    let findExist: AddressTag = await this.addressTagRepository.findOne({
      where: {
        address: request.address
      }
    });
    if (findExist) {
      await this.addressTagRepository.remove(findExist);
      return true;
    }
    return false;
  }
  async updateAddressTag(request: AddressTag): Promise<AddressTag> {
    let findExist: AddressTag = await this.addressTagRepository.findOne({
      where: {
        address: request.address
      }
    });
    if (findExist) {
      findExist.addressTag = request.addressTag;
      findExist.description = request.description;
    }
    else {
      findExist = {
        ...request,
        id: 0
      }
    }

    return await this.addressTagRepository.save(findExist);
  }
  constructor(
    @Inject(RepositoryConsts.LABEL_MARK_CONFIG_REPOSITORY)
    private labelMarkConfigRepository: Repository<LabelMarkConfig>,
    @Inject(RepositoryConsts.ADDRESS_TAG_REPOSITORY)
    private addressTagRepository: Repository<AddressTag>,
  ) { }

  async getWalletLabelConfig(): Promise<WalletLabelConfig> {
    let config = await this.labelMarkConfigRepository.findOne();
    let configJsonStr = config.config;
    return JSON.parse(configJsonStr);
  }

  async updateWalletLabelConfig(request: WalletLabelConfig): Promise<any> {
    request.lastUpdateTime = new Date();
    let content = JSON.stringify(request);

    let configModel = await this.labelMarkConfigRepository.findOne();
    configModel.config = content;
    await this.labelMarkConfigRepository.save(configModel);
    console.log('updateWalletLabelConfig success');

    return true;
  }

  async getAddressTagList(request: any): Promise<AddressTagResponse> {
    let resp = new AddressTagResponse();
    let addressTagList = await this.addressTagRepository.find({
      order: { id: 'DESC' }
    });
    resp.list = addressTagList;
    return resp;
  }
}
