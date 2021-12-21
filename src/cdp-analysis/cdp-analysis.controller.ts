import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChainState } from 'src/common/entity/CDPModule/chainState.entity';
import { CDChainStatisticResponse } from 'src/viewModel/cdp/CDChainStatisticResponse';
import { CDPBaseRequest } from 'src/viewModel/cdp/CDPBaseRequest';
import { CDPLoanActionKlineRequest } from 'src/viewModel/cdp/CDPLoanActionKlineRequest';
import { CDPLoanActionKlineResponse } from 'src/viewModel/cdp/CDPLoanActionKlineResponse';
import { CDPLoanActionRequest } from 'src/viewModel/cdp/CDPLoanActionRequest';
import { CDPLoanActionResponse } from 'src/viewModel/cdp/CDPLoanActionResponse';
import { CDPLoanPositionRequest } from 'src/viewModel/cdp/CDPLoanPositionRequest';
import { CDPLoanPositionResponse } from 'src/viewModel/cdp/CDPLoanPositionResponse';
import { CDPLoanPositionStatisticResponse } from 'src/viewModel/cdp/CDPLoanPositionStatisticResponse';
import { CDPAnalysisService } from './cdp-analysis.service';

@ApiTags('cdp-analysis')
@Controller('cdp-analysis')
export class CDPAnalysisController {
  constructor(private readonly service: CDPAnalysisService) { }
  @Post('/getChainState')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: ChainState })
  getChainState(@Body() request: CDPBaseRequest): Promise<ChainState> {
    return this.service.getChainState(request.chain, request.symbol);
  }

  @Post('/getChainStatistic')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CDChainStatisticResponse })
  getChainStatistic(@Body() request: CDPBaseRequest): Promise<CDChainStatisticResponse> {
    return this.service.getChainStatistic(request.chain, request.symbol);
  }

  @Post('/getLoanPositionList')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CDPLoanPositionResponse })
  getLoanPositionList(
    @Body() request: CDPLoanPositionRequest,
  ): Promise<CDPLoanPositionResponse> {
    return this.service.getLoanPositionList(request);
  }

  @Post('/getLoanPositionStatistic')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CDPLoanPositionStatisticResponse })
  getLoanPositionStatistic(
    @Body() request: CDPLoanPositionRequest,
  ): Promise<CDPLoanPositionStatisticResponse> {
    return this.service.getLoanPositionStatistic(request);
  }


  @Post('/getLoanActionList')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CDPLoanActionResponse })
  getLoanActionList(
    @Body() request: CDPLoanActionRequest,
  ): Promise<CDPLoanActionResponse> {
    return this.service.getLoanActionList(request);
  }

  @Post('/getLoanActionKline')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CDPLoanActionKlineResponse })
  getLoanActionKline(
    @Body() request: CDPLoanActionKlineRequest,
  ): Promise<CDPLoanActionKlineResponse> {
    return this.service.getLoanActionKline(request);
  }
}
