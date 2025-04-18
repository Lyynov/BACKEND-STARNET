// src/modules/radius/radius.controller.ts
import { Controller, Get, Post, Body, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { RadiusService } from './radius.service';
import { CreateRadiusUserDto } from './dto/create-radius-user.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../shared/dtos/pagination-query.dto';

@ApiTags('radius')
@ApiBearerAuth()
@Controller('radius')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class RadiusController {
  constructor(private readonly radiusService: RadiusService) {}

  @ApiOperation({ summary: 'Membuat pengguna RADIUS baru' })
  @ApiResponse({ status: 201, description: 'Pengguna RADIUS berhasil dibuat' })
  @Post('users')
  async createUser(@Body() createRadiusUserDto: CreateRadiusUserDto) {
    return this.radiusService.createUser(createRadiusUserDto);
  }

  @ApiOperation({ summary: 'Mendapatkan semua pengguna RADIUS' })
  @ApiResponse({ status: 200, description: 'Daftar pengguna RADIUS' })
  @Get('users')
  async findAllUsers(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    return this.radiusService.findAllUsers(page, limit);
  }

  @ApiOperation({ summary: 'Menghapus pengguna RADIUS' })
  @ApiResponse({ status: 200, description: 'Pengguna RADIUS berhasil dihapus' })
  @Delete('users/:username')
  async deleteUser(@Param('username') username: string) {
    return this.radiusService.deleteUser(username);
  }

  @ApiOperation({ summary: 'Mendapatkan sesi aktif RADIUS' })
  @ApiResponse({ status: 200, description: 'Daftar sesi aktif' })
  @Get('sessions')
  async getActiveSessions() {
    return this.radiusService.getActiveSessions();
  }
}