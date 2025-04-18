// src/modules/payment-gateway/dto/payment-callback.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentCallbackDto {
  @ApiProperty({
    description: 'Kode penyedia pembayaran',
    example: 'nicepay',
  })
  @IsNotEmpty({ message: 'Kode penyedia pembayaran tidak boleh kosong' })
  @IsString({ message: 'Kode penyedia pembayaran harus berupa string' })
  providerCode: string;

  @ApiPropertyOptional({
    description: 'ID transaksi dari payment gateway',
    example: 'NICEPAY-TX-123456789',
  })
  @IsOptional()
  @IsString({ message: 'ID transaksi harus berupa string' })
  externalId?: string;

  @ApiPropertyOptional({
    description: 'Nomor referensi internal',
    example: 'REF-123456789',
  })
  @IsOptional()
  @IsString({ message: 'Nomor referensi harus berupa string' })
  referenceNumber?: string;

  @ApiProperty({
    description: 'Data callback dari payment gateway',
    example: {
      transactionId: 'NICEPAY-TX-123456789',
      amount: 300000,
      status: 'PAID',
      paymentMethod: 'VIRTUAL_ACCOUNT',
      paymentDetail: {
        bank: 'BCA',
        accountNumber: '12345678901234'
      }
    },
  })
  @IsNotEmpty({ message: 'Data callback tidak boleh kosong' })
  @IsObject({ message: 'Data callback harus berupa objek' })
  callbackData: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Tanda tangan (signature) untuk verifikasi',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  @IsOptional()
  @IsString({ message: 'Tanda tangan harus berupa string' })
  signature?: string;
}