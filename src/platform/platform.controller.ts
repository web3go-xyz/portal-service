import { Body, Controller, Get, Param, Post, Query, } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { DataBoardViewCountQueryRequest } from 'src/viewModel/platform/DataBoardViewCountQueryRequest';

import { DataBoardViewCountRequest } from 'src/viewModel/platform/DataBoardViewCountRequest';
import { DataBoardViewCountResponse } from 'src/viewModel/platform/DataBoardViewCountResponse';

import { PlatformService } from './platform.service';


@Controller('/platform')
@ApiTags('platform')
export class PlatformController {
  constructor(
    private readonly platformService: PlatformService) { }


  // API for reporting the latest databoard view count
  @Post('/reportDataBoardViewCount')
  @ApiOperation({ summary: 'report view count+1 when view the databoard' })
  reportDataBoardViewCount(@Body() request: DataBoardViewCountRequest): any {

    return this.platformService.reportDataBoardViewCount(request.dataBoardId);
  }

  // API for querying databoard view count by databoard Id
  @Post('/queryDataBoardViewCount')
  @ApiOperation({ summary: 'query view count of databoard' })
  async queryDataBoardViewCount(@Body() request: DataBoardViewCountQueryRequest): Promise<DataBoardViewCountResponse[]> {
    return await this.platformService.queryDataBoardViewCount(request);
  }

  // API for checking if having the maintenance privilege
  @Post('/checkMaintenancePrivilege')
  async checkMaintenancePrivilege(@Body() request: any): Promise<boolean> {
    return request.code === 'Web3Go2022';
  }
}
