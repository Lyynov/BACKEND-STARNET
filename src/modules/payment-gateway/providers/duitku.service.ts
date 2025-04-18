// src/modules/payment-gateway/providers/duitku.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DuitkuService {
  private readonly logger = new Logger(DuitkuService.name);
  private readonly baseUrl: string;
  private readonly merchantCode: string;
  private readonly apiKey: string;
  private readonly callbackUrl: string;
  private readonly returnUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    // Inisialisasi dari config
    const env = this.configService.get<string>('NODE_ENV', 'development');
    const isProd = env === 'production';
    
    this.baseUrl = isProd 
      ? this.configService.get<string>('DUITKU_PROD_URL', 'https://passport.duitku.com/webapi') 
      : this.configService.get<string>('DUITKU_DEV_URL', 'https://sandbox.duitku.com/webapi');
    
    this.merchantCode = this.configService.get<string>('DUITKU_MERCHANT_CODE', '');
    this.apiKey = this.configService.get<string>('DUITKU_API_KEY', '');
    
    // URL untuk menerima callback dan redirect
    const apiBaseUrl = this.configService.get<string>('API_BASE_URL', 'http://localhost:3000/api');
    this.callbackUrl = `${apiBaseUrl}/payment-gateway/callback/duitku`;
    this.returnUrl = `${apiBaseUrl}/payment-gateway/return/duitku`;
  }

  // Membuat signature untuk verifikasi
  private generateSignature(merchantCode: string, amount: number, merchantOrderId: string): string {
    const md5Hash = crypto.createHash('md5').update(`${merchantCode}${amount}${merchantOrderId}${this.apiKey}`).digest('hex');
    return md5Hash;
  }

  // Mendapatkan daftar metode pembayaran yang tersedia
  async getPaymentMethods(amount: number): Promise<any> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payload = {
        merchantCode: this.merchantCode,
        amount: amount,
        timestamp: timestamp,
        signature: this.generateSignature(this.merchantCode, amount, timestamp),
      };

      const endpoint = `${this.baseUrl}/api/merchant/paymentmethod/getpaymentmethod`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Duitku payment methods: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting Duitku payment methods: ${error.message}`);
      throw error;
    }
  }

  // Membuat transaksi pembayaran
  async createTransaction(options: {
    paymentAmount: number;
    orderId: string;
    productDetails: string;
    customerName: string;
    customerEmail: string;
    paymentMethod: string;
    expiryPeriod?: number;
    additionalParam?: string;
  }): Promise<any> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const merchantOrderId = options.orderId || `STAR-${uuidv4().substring(0, 8)}`;
      
      const signature = this.generateSignature(
        this.merchantCode,
        options.paymentAmount,
        merchantOrderId
      );
      
      const payload = {
        merchantCode: this.merchantCode,
        paymentAmount: options.paymentAmount,
        paymentMethod: options.paymentMethod,
        merchantOrderId: merchantOrderId,
        productDetails: options.productDetails,
        customerVaName: options.customerName,
        email: options.customerEmail,
        callbackUrl: this.callbackUrl,
        returnUrl: this.returnUrl,
        signature: signature,
        expiryPeriod: options.expiryPeriod || 60, // Default: 60 menit
        additionalParam: options.additionalParam || '',
      };

      const endpoint = `${this.baseUrl}/api/merchant/v2/inquiry`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Duitku transaction created: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating Duitku transaction: ${error.message}`);
      throw error;
    }
  }

  // Mendapatkan status transaksi
  async checkTransactionStatus(merchantOrderId: string): Promise<any> {
    try {
      const signature = this.generateSignature(this.merchantCode, 0, merchantOrderId);
      
      const payload = {
        merchantCode: this.merchantCode,
        merchantOrderId: merchantOrderId,
        signature: signature,
      };

      const endpoint = `${this.baseUrl}/api/merchant/transactionStatus`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Duitku transaction status: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error checking Duitku transaction status: ${error.message}`);
      throw error;
    }
  }

  // Memverifikasi callback dari Duitku
  verifyCallback(callbackData: Record<string, any>): boolean {
    try {
      if (!callbackData || !callbackData.merchantOrderId || !callbackData.signature) {
        return false;
      }

      const amount = parseInt(callbackData.amount, 10);
      const merchantOrderId = callbackData.merchantOrderId;
      const receivedSignature = callbackData.signature;
      
      const expectedSignature = this.generateSignature(
        this.merchantCode,
        amount,
        merchantOrderId
      );

      return receivedSignature === expectedSignature;
    } catch (error) {
      this.logger.error(`Error verifying Duitku callback: ${error.message}`);
      return false;
    }
  }

  // Membatalkan transaksi
  async cancelTransaction(merchantOrderId: string): Promise<any> {
    try {
      const signature = this.generateSignature(this.merchantCode, 0, merchantOrderId);
      
      const payload = {
        merchantCode: this.merchantCode,
        merchantOrderId: merchantOrderId,
        signature: signature,
      };

      const endpoint = `${this.baseUrl}/api/merchant/cancelTransaction`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Duitku transaction canceled: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error canceling Duitku transaction: ${error.message}`);
      throw error;
    }
  }
}