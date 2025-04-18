// src/modules/billing/billing.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../shared/dtos/pagination-query.dto';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @ApiOperation({ summary: 'Membuat faktur baru' })
  @ApiResponse({ status: 201, description: 'Faktur berhasil dibuat' })
  @Post('invoices')
  @Roles('admin', 'staff')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.billingService.createInvoice(createInvoiceDto);
  }

  @ApiOperation({ summary: 'Mendapatkan semua faktur' })
  @ApiResponse({ status: 200, description: 'Daftar faktur' })
  @Get('invoices')
  @Roles('admin', 'staff')
  async findAllInvoices(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10, status } = query;
    return this.billingService.findAllInvoices(page, limit, status);
  }

  @ApiOperation({ summary: 'Mendapatkan faktur berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail faktur' })
  @ApiResponse({ status: 404, description: 'Faktur tidak ditemukan' })
  @Get('invoices/:id')
  @Roles('admin', 'staff')
  async findInvoiceById(@Param('id') id: string) {
    return this.billingService.findInvoiceById(id);
  }

  @ApiOperation({ summary: 'Memperbarui faktur' })
  @ApiResponse({ status: 200, description: 'Faktur berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Faktur tidak ditemukan' })
  @Put('invoices/:id')
  @Roles('admin', 'staff')
  async updateInvoice(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.billingService.updateInvoice(id, updateInvoiceDto);
  }

  @ApiOperation({ summary: 'Membatalkan faktur' })
  @ApiResponse({ status: 200, description: 'Faktur berhasil dibatalkan' })
  @ApiResponse({ status: 404, description: 'Faktur tidak ditemukan' })
  @Delete('invoices/:id')
  @Roles('admin')
  async cancelInvoice(@Param('id') id: string) {
    return this.billingService.cancelInvoice(id);
  }

  @ApiOperation({ summary: 'Mencatat pembayaran' })
  @ApiResponse({ status: 201, description: 'Pembayaran berhasil dicatat' })
  @Post('payments')
  @Roles('admin', 'staff')
  async recordPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.billingService.recordPayment(createPaymentDto);
  }

  @ApiOperation({ summary: 'Mendapatkan faktur berdasarkan pelanggan' })
  @ApiResponse({ status: 200, description: 'Daftar faktur pelanggan' })
  @Get('customers/:customerId/invoices')
  @Roles('admin', 'staff')
  async findInvoicesByCustomerId(
    @Param('customerId') customerId: string,
    @Query() query: PaginationQueryDto,
  ) {
    const { page = 1, limit = 10, status } = query;
    return this.billingService.findInvoicesByCustomerId(customerId, page, limit, status);
  }

  @ApiOperation({ summary: 'Mendapatkan statistik penagihan' })
  @ApiResponse({ status: 200, description: 'Statistik penagihan' })
  @Get('stats')
  @Roles('admin', 'staff')
  async getBillingStats() {
    return this.billingService.getBillingStats();
  }
}