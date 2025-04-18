// src/modules/monitoring/monitoring.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DateRangeDto } from './dto/date-range.dto';

@ApiTags('Monitoring')
@ApiBearerAuth()
@Controller('monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @ApiOperation({ summary: 'Get system resources' })
  @ApiResponse({ status: 200, description: 'Return system resources' })
  @Get('resources')
  @Roles('admin', 'staff')
  async getResources() {
    return this.monitoringService.getSystemResources();
  }

  @ApiOperation({ summary: 'Get resources history' })
  @ApiResponse({ status: 200, description: 'Return resources history' })
  @Get('resources/history')
  @Roles('admin', 'staff')
  async getResourcesHistory(@Query() dateRange: DateRangeDto) {
    return this.monitoringService.getResourcesHistory(dateRange.startDate, dateRange.endDate);
  }

  @ApiOperation({ summary: 'Get traffic data' })
  @ApiResponse({ status: 200, description: 'Return traffic data' })
  @Get('traffic')
  @Roles('admin', 'staff')
  async getTraffic() {
    return this.monitoringService.getCurrentTraffic();
  }

  @ApiOperation({ summary: 'Get traffic history' })
  @ApiResponse({ status: 200, description: 'Return traffic history' })
  @Get('traffic/history')
  @Roles('admin', 'staff')
  async getTrafficHistory(@Query() dateRange: DateRangeDto) {
    return this.monitoringService.getTrafficHistory(dateRange.startDate, dateRange.endDate);
  }

  @ApiOperation({ summary: 'Get active PPPoE sessions' })
  @ApiResponse({ status: 200, description: 'Return active PPPoE sessions' })
  @Get('sessions')
  @Roles('admin', 'staff')
  async getActiveSessions() {
    return this.monitoringService.getActivePPPoESessions();
  }

  @ApiOperation({ summary: 'Get user bandwidth usage' })
  @ApiResponse({ status: 200, description: 'Return user bandwidth usage' })
  @Get('users/:username/usage')
  @Roles('admin', 'staff')
  async getUserUsage(@Param('username') username: string, @Query() dateRange: DateRangeDto) {
    return this.monitoringService.getUserBandwidthUsage(username, dateRange.startDate, dateRange.endDate);
  }
}
