import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { join } from 'path';
import { PublishDataBoardRequest, PublishDataBoardResponse } from 'src/viewModel/analytics-insight/PublishDataBoard';
import { QueryDataBoardListRequest, QueryDataBoardListResponse } from 'src/viewModel/analytics-insight/QueryDataBoardList';
import { RemoveDataBoardRequest, RemoveDataBoardResponse } from 'src/viewModel/analytics-insight/RemoveDataBoard';
import { FileUploadDto } from 'src/viewModel/base/FileUploadDto';

import { AnalyticsInsightService } from './analytics-insight.service';

@Controller('/analytics-insight')
@ApiTags('analytics-insight')
export class AnalyticsInsightController {
  constructor(
    private readonly service: AnalyticsInsightService) { }


  @Post('snapshotUpload')
  @ApiOperation({ summary: 'upload img as snapshot of dashoboard' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  snapshotUpload(@UploadedFile() file, @Body() body) {

    let dir = join(__dirname, '/dashboardSnapshot');

    if (existsSync(dir) == false) {
      mkdirSync(dir);
    }

    let path = "s-" + (new Date()).getTime() + file.originalname.substr(file.originalname.indexOf('.'));
    let fullPath = join(dir, `${path}`);
    const writeImage = createWriteStream(fullPath)
    writeImage.write(file.buffer);
    console.log("snapshotUpload path:", fullPath);

    return path;
  }


  @Post('/publishDashboard')
  @ApiOperation({ summary: 'publish databoard' })
  publishDashboard(@Body() request: PublishDataBoardRequest): Promise<PublishDataBoardResponse> {

    return this.service.publishDashboard(request);
  }
  @Post('/removeDashboard')
  @ApiOperation({ summary: 'publish databoard' })
  removeDashboard(@Body() request: RemoveDataBoardRequest): Promise<RemoveDataBoardResponse> {

    return this.service.removeDashboard(request);
  }
  @Post('/queryDataBoardList')
  @ApiOperation({ summary: 'query list of databoard' })
  async queryDataBoardList(@Body() request: QueryDataBoardListRequest): Promise<QueryDataBoardListResponse> {
    return await this.service.queryDataBoardList(request);
  }


}
