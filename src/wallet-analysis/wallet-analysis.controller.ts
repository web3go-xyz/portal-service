import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressTagResponse } from 'src/viewModel/chain/AddressTagResponse';
import { ChainListResponse } from 'src/viewModel/chain/chainListResponse';
import { LabelDefResponse } from 'src/viewModel/chain/LabelResponse';
import { ChainWalletAddressRequest } from 'src/viewModel/wallet-analysis/chainWalletAddressRequest';
import { WalletAddressListResponse } from 'src/viewModel/wallet-analysis/walletAddressListResponse';
import { WalletAddressSimpleInfoRequest } from 'src/viewModel/wallet-analysis/walletAddressSimpleInfoRequest';
import { WalletAddressSimpleInfoResponse } from 'src/viewModel/wallet-analysis/walletAddressSimpleInfoResponse';
import { WalletAddressTransactionRequest } from 'src/viewModel/wallet-analysis/walletAddressTransactionRequest';
import { WalletAddressTransactionResponse } from 'src/viewModel/wallet-analysis/walletAddressTransactionResponse';

import { WalletAnalysisService } from './wallet-analysis.service';

@ApiTags('wallet-analysis')
@Controller('wallet-analysis')
export class WalletAnalysisController {
  constructor(private readonly service: WalletAnalysisService) {}

  // API for retriving the list of all the chains
  @Post('/getChainList')
  @ApiOperation({ summary: '' })
  getChainList(@Body() body): Promise<ChainListResponse> {
    return this.service.getChainList();
  }

  // API for retriving the wallet address list by contract address, wallet address
  // labels, orderbys, etc
  @Post('/getWalletAddressList')
  @ApiOperation({ summary: '' })
  getWalletAddressList(
    @Body() request: ChainWalletAddressRequest,
  ): Promise<WalletAddressListResponse> {
    return this.service.getWalletAddressList(request);
  }

  // API for retriving wallet address simple info including wallet address,
  // contract address, balance, etc
  @Post('/getWalletAddressSimpleInfo')
  @ApiOperation({ summary: '' })
  getWalletAddressSimpleInfo(
    @Body() request: WalletAddressSimpleInfoRequest,
  ): Promise<WalletAddressSimpleInfoResponse> {
    return this.service.getWalletAddressSimpleInfo(request);
  }

  // API for retriving wallet address transaction info including 
  // transactionTimestamp, sender address, reciever address, etc
  @Post('/getWalletAddressTransactionInfo')
  @ApiOperation({ summary: '' })
  getWalletAddressTransactionInfo(
    @Body() request: WalletAddressTransactionRequest,
  ): Promise<WalletAddressTransactionResponse> {
    return this.service.getWalletAddressTransactionInfo(request);
  }

  // API for retriving the list of address tags
  @Post('/getAddressTagList')
  @ApiOperation({ summary: '' })
  getAddressTagList(@Body() request: any): Promise<AddressTagResponse> {
    return this.service.getAddressTagList(request);
  }

  // API for retriving address label definitions
  @Post('/getLabelDefs')
  @ApiOperation({ summary: 'get label definition list' })
  getLabelDefs(): LabelDefResponse {
    return this.service.getLabelDefs();
  }
}
