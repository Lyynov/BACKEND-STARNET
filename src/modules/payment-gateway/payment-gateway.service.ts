// src/modules/payment-gateway/providers/nicepay.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NicepayService {
  private readonly logger = new Logger(NicepayService.name);
  private readonly baseUrl: string;
  private readonly merchantId: string;
  private readonly merchantKey: string;
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
      ? this.configService.get<string>('NICEPAY_PROD_URL', 'https://www.nicepay.co.id/nicepay') 
      : this.configService.get<string>('NICEPAY_DEV_URL', 'https://dev.nicepay.co.id/nicepay');
    
    this.merchantId = this.configService.get<string>('NICEPAY_MERCHANT_ID', '');
    this.merchantKey = this.configService.get<string>('NICEPAY_MERCHANT_KEY', '');
    
    // URL untuk menerima callback dan redirect
    const apiBaseUrl = this.configService.get<string>('API_BASE_URL', 'http://localhost:3000/api');
    this.callbackUrl = `${apiBaseUrl}/payment-gateway/callback/nicepay`;
    this.returnUrl = `${apiBaseUrl}/payment-gateway/return/nicepay`;
  }

  // Membuat signature untuk verifikasi
  private generateSignature(data: Record<string, any>, timestamp: string): string {
    const stringToSign = `${this.merchantId}${timestamp}${data.amount}${this.merchantKey}`;
    return crypto.createHash('sha256').update(stringToSign).digest('hex');
  }

  // Membuat virtual account payment request
  async createVirtualAccountPayment(options: {
    amount: number;
    orderId: string;
    customerName: string;
    customerEmail: string;
    bankCode: string;
    description?: string;
    expiryMinutes?: number;
  }): Promise<any> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const referenceNumber = options.orderId || `STAR-${uuidv4().substring(0, 8)}`;
      
      const payload = {
        timestamp,
        merchantId: this.merchantId,
        referenceNo: referenceNumber,
        amount: options.amount,
        currency: 'IDR',
        description: options.description || 'Payment for Star Access ISP',
        customerName: options.customerName,
        customerEmail: options.customerEmail,
        billingAddress: {
          firstName: options.customerName.split(' ')[0],
          lastName: options.customerName.split(' ').slice(1).join(' ') || '-',
          email: options.customerEmail,
          phone: '',
          address: '-',
          city: '-',
          countryCode: 'ID',
        },
        callbackUrl: this.callbackUrl,
        returnUrl: this.returnUrl,
        expiryDate: options.expiryMinutes 
          ? new Date(Date.now() + options.expiryMinutes * 60 * 1000).toISOString() 
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default: 24 jam
        payMethod: 'VA',
        bankCode: options.bankCode, // 'BMRI', 'BCA', 'BRI', dll.
      };
      
      // Generate signature
      const signature = this.generateSignature(payload, timestamp);
      payload['signature'] = signature;

      // Kirim request ke Nicepay
      const endpoint = `${this.baseUrl}/api/v1.0/payments/create-va`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Nicepay VA payment created: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating Nicepay VA payment: ${error.message}`);
      throw error;
    }
  }

  // Membuat credit card payment request
  async createCreditCardPayment(options: {
    amount: number;
    orderId: string;
    customerName: string;
    customerEmail: string;
    description?: string;
    expiryMinutes?: number;
  }): Promise<any> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const referenceNumber = options.orderId || `STAR-${uuidv4().substring(0, 8)}`;
      
      const payload = {
        timestamp,
        merchantId: this.merchantId,
        referenceNo: referenceNumber,
        amount: options.amount,
        currency: 'IDR',
        description: options.description || 'Payment for Star Access ISP',
        customerName: options.customerName,
        customerEmail: options.customerEmail,
        billingAddress: {
          firstName: options.customerName.split(' ')[0],
          lastName: options.customerName.split(' ').slice(1).join(' ') || '-',
          email: options.customerEmail,
          phone: '',
          address: '-',
          city: '-',
          countryCode: 'ID',
        },
        callbackUrl: this.callbackUrl,
        returnUrl: this.returnUrl,
        expiryDate: options.expiryMinutes 
          ? new Date(Date.now() + options.expiryMinutes * 60 * 1000).toISOString() 
          : new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Default: 1 jam
        payMethod: 'CC',
      };
      
      // Generate signature
      const signature = this.generateSignature(payload, timestamp);
      payload['signature'] = signature;

      // Kirim request ke Nicepay
      const endpoint = `${this.baseUrl}/api/v1.0/payments/create-credit-card`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Nicepay Credit Card payment created: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating Nicepay Credit Card payment: ${error.message}`);
      throw error;
    }
  }

  // Mendapatkan status pembayaran
  async checkPaymentStatus(referenceNumber: string): Promise<any> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      
      const payload = {
        timestamp,
        merchantId: this.merchantId,
        referenceNo: referenceNumber,
      };
      
      // Generate signature khusus untuk inquiry
      const stringToSign = `${this.merchantId}${timestamp}${this.merchantKey}`;
      const signature = crypto.createHash('sha256').update(stringToSign).digest('hex');
      payload['signature'] = signature;

      // Kirim request ke Nicepay
      const endpoint = `${this.baseUrl}/api/v1.0/payments/status`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Nicepay payment status: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error checking Nicepay payment status: ${error.message}`);
      throw error;
    }
  }

  // Memverifikasi callback dari Nicepay
  verifyCallback(callbackData: Record<string, any>): boolean {
    try {
      if (!callbackData || !callbackData.signature || !callbackData.timestamp || !callbackData.amount) {
        return false;
      }

      const receivedSignature = callbackData.signature;
      const stringToSign = `${this.merchantId}${callbackData.timestamp}${callbackData.amount}${this.merchantKey}`;
      const expectedSignature = crypto.createHash('sha256').update(stringToSign).digest('hex');

      return receivedSignature === expectedSignature;
    } catch (error) {
      this.logger.error(`Error verifying Nicepay callback: ${error.message}`);
      return false;
    }
  }

  // Membatalkan transaksi
  async cancelTransaction(referenceNumber: string, reason: string = 'Canceled by merchant'): Promise<any> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      
      const payload = {
        timestamp,
        merchantId: this.merchantId,
        referenceNo: referenceNumber,
        reason: reason,
      };
      
      // Generate signature khusus untuk cancel
      const stringToSign = `${this.merchantId}${timestamp}${this.merchantKey}`;
      const signature = crypto.createHash('sha256').update(stringToSign).digest('hex');
      payload['signature'] = signature;

      // Kirim request ke Nicepay
      const endpoint = `${this.baseUrl}/api/v1.0/payments/cancel`;
      const response = await lastValueFrom(
        this.httpService.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      this.logger.log(`Nicepay payment canceled: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error canceling Nicepay payment: ${error.message}`);
      throw error;
    }
  }
}