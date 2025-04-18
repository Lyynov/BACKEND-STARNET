
// src/modules/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportPeriodDto } from './dto/report-period.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get revenue report' })
  @ApiResponse({ status: 200, description: 'Return revenue report' })
  @Get('revenue')
  async getRevenueReport(@Query() reportPeriod: ReportPeriodDto) {
    return this.reportsService.getRevenueReport(
      reportPeriod.period,
      reportPeriod.startDate,
      reportPeriod.endDate,
    );
  }

  @ApiOperation({ summary: 'Get customer report' })
  @ApiResponse({ status: 200, description: 'Return customer report' })
  @Get('customers')
  async getCustomerReport(@Query() reportPeriod: ReportPeriodDto) {
    return this.reportsService.getCustomerReport(
      reportPeriod.period,
      reportPeriod.startDate,
      reportPeriod.endDate,
    );
  }

  @ApiOperation({ summary: 'Get voucher report' })
  @ApiResponse({ status: 200, description: 'Return voucher report' })
  @Get('vouchers')
  async getVoucherReport(@Query() reportPeriod: ReportPeriodDto) {
    return this.reportsService.getVoucherReport(
      reportPeriod.period,
      reportPeriod.startDate,
      reportPeriod.endDate,
    );
  }

  @ApiOperation({ summary: 'Get bandwidth usage report' })
  @ApiResponse({ status: 200, description: 'Return bandwidth usage report' })
  @Get('bandwidth')
  async getBandwidthReport(@Query() reportPeriod: ReportPeriodDto) {
    return this.reportsService.getBandwidthReport(
      reportPeriod.period,
      reportPeriod.startDate,
      reportPeriod.endDate,
    );
  }
}
