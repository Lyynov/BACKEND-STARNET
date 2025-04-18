// src/modules/payment-gateway/payment-gateway.controller.ts
import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { PaymentQueryDto } from './dto/payment-query.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Public } from '../../core/decorators/public.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('payment-gateway')
@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @ApiOperation({ summary: 'Mendapatkan semua provider pembayaran' })
  @ApiResponse({ status: 200, description: 'Daftar provider pembayaran' })
  @Get('providers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllProviders() {
    return this.paymentGatewayService.getAllProviders();
  }

  @ApiOperation({ summary: 'Mendapatkan metode pembayaran berdasarkan provider' })
  @ApiResponse({ status: 200, description: 'Daftar metode pembayaran' })
  @ApiResponse({ status: 404, description: 'Provider tidak ditemukan' })
  @Get('providers/:code/methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPaymentMethodsByProvider(@Param('code') providerCode: string) {
    return this.paymentGatewayService.getPaymentMethodsByProvider(providerCode);
  }

  @ApiOperation({ summary: 'Membuat transaksi pembayaran baru' })
  @ApiResponse({ status: 201, description: 'Transaksi pembayaran berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  @ApiResponse({ status: 404, description: 'Faktur atau metode pembayaran tidak ditemukan' })
  @Post('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentGatewayService.createPayment(createPaymentDto);
  }

  @ApiOperation({ summary: 'Mendapatkan transaksi berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail transaksi' })
  @ApiResponse({ status: 404, description: 'Transaksi tidak ditemukan' })
  @Get('transactions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTransactionById(@Param('id') id: string) {
    return this.paymentGatewayService.getTransactionById(id);
  }

  @ApiOperation({ summary: 'Mendapatkan transaksi berdasarkan nomor referensi' })
  @ApiResponse({ status: 200, description: 'Detail transaksi' })
  @ApiResponse({ status: 404, description: 'Transaksi tidak ditemukan' })
  @Get('transactions/reference/:referenceNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTransactionByReferenceNumber(@Param('referenceNumber') referenceNumber: string) {
    return this.paymentGatewayService.getTransactionByReferenceNumber(referenceNumber);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar transaksi' })
  @ApiResponse({ status: 200, description: 'Daftar transaksi' })
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTransactions(@Query() queryDto: PaymentQueryDto) {
    return this.paymentGatewayService.getTransactions(queryDto);
  }

  @ApiOperation({ summary: 'Memeriksa status pembayaran dari provider' })
  @ApiResponse({ status: 200, description: 'Status pembayaran' })
  @ApiResponse({ status: 404, description: 'Transaksi tidak ditemukan' })
  @Get('check-status/:referenceNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async checkPaymentStatus(@Param('referenceNumber') referenceNumber: string) {
    return this.paymentGatewayService.checkPaymentStatus(referenceNumber);
  }

  @ApiOperation({ summary: 'Membatalkan transaksi pembayaran' })
  @ApiResponse({ status: 200, description: 'Transaksi berhasil dibatalkan' })
  @ApiResponse({ status: 400, description: 'Transaksi tidak dapat dibatalkan' })
  @ApiResponse({ status: 404, description: 'Transaksi tidak ditemukan' })
  @Post('cancel/:referenceNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  async cancelTransaction(@Param('referenceNumber') referenceNumber: string) {
    return this.paymentGatewayService.cancelTransaction(referenceNumber);
  }

  @ApiOperation({ summary: 'Endpoint callback untuk payment gateway' })
  @ApiResponse({ status: 200, description: 'Callback berhasil diproses' })
  @Post('callback/:provider')
  @Public()
  async handleCallback(
    @Param('provider') providerCode: string,
    @Body() callbackData: any,
    @Req() req: Request,
  ) {
    const callbackDto: PaymentCallbackDto = {
      providerCode,
      callbackData,
      signature: req.headers['x-signature'] as string || callbackData.signature,
      externalId: callbackData.transactionId || callbackData.txid || callbackData.reference,
      referenceNumber: callbackData.referenceNo || callbackData.merchantOrderId || callbackData.merchantInvoice,
    };
    
    return this.paymentGatewayService.handleCallback(callbackDto);
  }

  @ApiOperation({ summary: 'Endpoint return untuk payment gateway' })
  @ApiResponse({ status: 302, description: 'Redirect ke halaman status pembayaran' })
  @Get('return/:provider')
  @Public()
  async handleReturn(
    @Param('provider') providerCode: string,
    @Query() queryParams: any,
    @Res() res: Response,
  ) {
    // Mendapatkan referenceNumber dari query params (berbeda untuk setiap provider)
    let referenceNumber = '';
    
    if (providerCode === 'nicepay') {
      referenceNumber = queryParams.referenceNo;
    } else if (providerCode === 'duitku') {
      referenceNumber = queryParams.merchantOrderId;
    }
    
    if (!referenceNumber) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Nomor referensi tidak ditemukan',
      });
    }
    
    // Dalam kasus nyata, Anda akan me-redirect ke frontend dengan referenceNumber
    // untuk menampilkan halaman status pembayaran
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    return res.redirect(`${frontendUrl}/payment/status/${referenceNumber}`);
  }

  @ApiOperation({ summary: 'Mendapatkan statistik payment gateway' })
  @ApiResponse({ status: 200, description: 'Statistik payment gateway' })
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async getPaymentGatewayStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.paymentGatewayService.getPaymentGatewayStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}