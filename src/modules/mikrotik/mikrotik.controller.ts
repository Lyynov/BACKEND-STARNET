// src/modules/mikrotik/mikrotik.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { AddRouterDto } from './dto/add-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('mikrotik')
@ApiBearerAuth()
@Controller('mikrotik')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MikrotikController {
  constructor(private readonly mikrotikService: MikrotikService) {}

  @ApiOperation({ summary: 'Menambahkan router baru' })
  @ApiResponse({ status: 201, description: 'Router berhasil ditambahkan' })
  @ApiResponse({ status: 400, description: 'Data router tidak valid' })
  @Post('routers')
  @Roles('admin')
  async addRouter(@Body() addRouterDto: AddRouterDto) {
    return this.mikrotikService.addRouter(addRouterDto);
  }

  @ApiOperation({ summary: 'Mendapatkan semua router' })
  @ApiResponse({ status: 200, description: 'Daftar router' })
  @Get('routers')
  @Roles('admin', 'staff')
  async findAllRouters() {
    return this.mikrotikService.findAllRouters();
  }

  @ApiOperation({ summary: 'Mendapatkan router berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail router' })
  @ApiResponse({ status: 404, description: 'Router tidak ditemukan' })
  @Get('routers/:id')
  @Roles('admin', 'staff')
  async getRouterById(@Param('id') id: string) {
    return this.mikrotikService.getRouterById(id);
  }

  @ApiOperation({ summary: 'Memperbarui router' })
  @ApiResponse({ status: 200, description: 'Router berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Router tidak ditemukan' })
  @Put('routers/:id')
  @Roles('admin')
  async updateRouter(@Param('id') id: string, @Body() updateRouterDto: UpdateRouterDto) {
    return this.mikrotikService.updateRouter(id, updateRouterDto);
  }

  @ApiOperation({ summary: 'Menghapus router' })
  @ApiResponse({ status: 200, description: 'Router berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Router tidak ditemukan' })
  @Delete('routers/:id')
  @Roles('admin')
  async removeRouter(@Param('id') id: string) {
    return this.mikrotikService.removeRouter(id);
  }

  @ApiOperation({ summary: 'Mendapatkan pengguna PPPoE dari router' })
  @ApiResponse({ status: 200, description: 'Daftar pengguna PPPoE' })
  @ApiResponse({ status: 404, description: 'Router tidak ditemukan' })
  @Get('routers/:id/pppoe-users')
  @Roles('admin', 'staff')
  async getPPPoEUsers(@Param('id') id: string) {
    return this.mikrotikService.getPPPoEUsers(id);
  }

  @ApiOperation({ summary: 'Mendapatkan sesi aktif PPPoE dari router' })
  @ApiResponse({ status: 200, description: 'Daftar sesi aktif PPPoE' })
  @ApiResponse({ status: 404, description: 'Router tidak ditemukan' })
  @Get('routers/:id/pppoe-sessions')
  @Roles('admin', 'staff')
  async getPPPoEActiveSessions(@Param('id') id: string) {
    return this.mikrotikService.getPPPoEActiveSessions(id);
  }

  @ApiOperation({ summary: 'Mendapatkan statistik router' })
  @ApiResponse({ status: 200, description: 'Statistik router' })
  @ApiResponse({ status: 404, description: 'Router tidak ditemukan' })
  @Get('routers/:id/statistics')
  @Roles('admin', 'staff')
  async getRouterStatistics(@Param('id') id: string) {
    return this.mikrotikService.getRouterStatistics(id);
  }
}