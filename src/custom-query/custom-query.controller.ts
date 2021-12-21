import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomQuery } from 'src/common/entity/CustomQueryModule/customQuery.entity';
import { CustomQueryCreateRequest } from 'src/viewModel/custom-query/CustomQueryCreateRequest';
import { CustomQueryDataTableRequest } from 'src/viewModel/custom-query/CustomQueryDataTableRequest';
import { CustomQueryExecuteRequest } from 'src/viewModel/custom-query/CustomQueryExecuteRequest';
import { CustomQueryRequest } from 'src/viewModel/custom-query/CustomQueryRequest';
import { CustomQueryUpdateRequest } from 'src/viewModel/custom-query/CustomQueryUpdateRequest';
import { DataTable } from 'src/viewModel/custom-query/DataTable';
import { DataTableColumn } from 'src/viewModel/custom-query/DataTableColumn';
import { CustomQueryService } from './custom-query.service';

@ApiTags('custom-query')
@Controller('custom-query')
export class CustomQueryController {
  constructor(private readonly service: CustomQueryService) { }

  @Post('/getList')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CustomQuery, isArray: true })
  async getList(): Promise<CustomQuery[]> {
    return this.service.getList();
  }


  @Post('/getDetail')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CustomQuery, isArray: false })
  async getDetail(@Body() request: CustomQueryRequest): Promise<CustomQuery> {
    return this.service.getDetail(request.id);
  }


  @Post('/remove')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CustomQuery, isArray: false })
  async remove(@Body() request: CustomQueryRequest): Promise<CustomQuery> {
    return this.service.remove(request.id);
  }


  @Post('/create')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CustomQuery, isArray: false })
  async create(@Body() request: CustomQueryCreateRequest): Promise<CustomQuery> {
    return this.service.create(request as CustomQuery);
  }


  @Post('/update')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: CustomQuery, isArray: false })
  async update(@Body() request: CustomQueryUpdateRequest): Promise<CustomQuery> {
    return this.service.update(request as CustomQuery);
  }

  @Post('/executeQuery')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: Object })
  async executeQuery(@Body() request: CustomQueryExecuteRequest): Promise<any> {
    return this.service.executeQuery(request);
  }


  @Post('/getTables')
  @ApiOperation({ summary: '' })
  @ApiOkResponse({ type: DataTable, isArray: true })
  async getTables(@Body() request: CustomQueryDataTableRequest): Promise<DataTable[]> {
    return this.service.getTables(request);
  }

}
