import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  getReport(

    @Query('startDate')
    startDate?: string,

    @Query('endDate')
    endDate?: string,

    @Query('type')
    type?: string,

  ) {

    return this.reportsService.getReport(
      startDate,
      endDate,
      type,
    );
  }
}