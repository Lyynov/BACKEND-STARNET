// src/modules/vouchers/vouchers.controller.ts
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { GenerateVouchersDto } from './dto/generate-vouchers.dto';
import { ActivateVoucherDto } from './dto/activate-voucher.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Public } from '../../core/decorators/public.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../shared/dtos/pagination-query.dto';

@ApiTags('vouchers')
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @ApiOperation({ summary: 'Generate voucher baru' })
  @ApiResponse({ status: 201, description: 'Voucher berhasil digenerate' })
  @Post('generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  async generateVouchers(@Body() generateVouchersDto: GenerateVouchersDto) {
    return this.vouchersService.generateVouchers(generateVouchersDto);
  }

  @ApiOperation({ summary: 'Mendapatkan semua voucher' })
  @ApiResponse({ status: 200, description: 'Daftar voucher' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  async findAll(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10, status } = query;
    return this.vouchersService.findAllVouchers(page, limit, status);
  }

  @ApiOperation({ summary: 'Mendapatkan voucher berdasarkan kode' })
  @ApiResponse({ status: 200, description: 'Detail voucher' })
  @ApiResponse({ status: 404, description: 'Voucher tidak ditemukan' })
  @Get(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  async findByCode(@Param('code') code: string) {
    return this.vouchersService.findVoucherByCode(code);
  }

  @ApiOperation({ summary: 'Mengaktifkan voucher' })
  @ApiResponse({ status: 200, description: 'Voucher berhasil diaktifkan' })
  @ApiResponse({ status: 400, description: 'Voucher sudah digunakan atau kadaluwarsa' })
  @ApiResponse({ status: 404, description: 'Voucher tidak ditemukan' })
  @Post('activate')
  @Public()
  async activateVoucher(@Body() activateVoucherDto: ActivateVoucherDto) {
    return this.vouchersService.activateVoucher(activateVoucherDto);
  }

  @ApiOperation({ summary: 'Mendapatkan statistik voucher' })
  @ApiResponse({ status: 200, description: 'Statistik voucher' })
  @Get('stats/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  async getVoucherStats() {
    return this.vouchersService.getVoucherStats();
  }
}