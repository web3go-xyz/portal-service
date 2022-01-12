import { Body, Controller, Get, Param, Post, Query, } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty } from '@nestjs/swagger';

import { DataBoardViewCountRequest } from 'src/viewModel/platform/DataBoardViewCountRequest';
import { DataBoardViewCountResponse } from 'src/viewModel/platform/DataBoardViewCountResponse';

import { PlatformService } from './platform.service';


@Controller('/platform')
export class PlatformController {
  constructor(
    private readonly platformService: PlatformService) { }



  @Post('/reportDataBoardViewCount')
  @ApiOperation({ summary: 'report view count+1 when view the databoard' })
  reportDataBoardViewCount(@Body() request: DataBoardViewCountRequest): any {

    return this.platformService.reportDataBoardViewCount(request.dataBoardId);
  }
  @Post('/queryDataBoardViewCount')
  @ApiOperation({ summary: 'query view count of databoard' })
  async queryDataBoardViewCount(@Body() request: any): Promise<DataBoardViewCountResponse[]> {
    return await this.platformService.queryDataBoardViewCount();
  }

  @Post('/checkMaintenancePrivilege')
  async checkMaintenancePrivilege(@Body() request: any): Promise<boolean> {
    return request.code === 'Web3Go2022';
  }
}
