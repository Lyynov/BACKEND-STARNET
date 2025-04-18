// src/modules/payment-gateway/dto/create-payment.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsPositive, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID faktur yang akan dibayar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID faktur tidak boleh kosong' })
  @IsUUID('4', { message: 'Format ID faktur tidak valid' })
  invoiceId: string;

  @ApiProperty({
    description: 'Kode penyedia pembayaran',
    example: 'nicepay',
  })
  @IsNotEmpty({ message: 'Kode penyedia pembayaran tidak boleh kosong' })
  @IsString({ message: 'Kode penyedia pembayaran harus berupa string' })
  providerCode: string;

  @ApiProperty({
    description: 'Kode metode pembayaran',
    example: 'va_bca',
  })
  @IsNotEmpty({ message: 'Kode metode pembayaran tidak boleh kosong' })
  @IsString({ message: 'Kode metode pembayaran harus berupa string' })
  methodCode: string;

  @ApiPropertyOptional({
    description: 'Jumlah pembayaran (opsional, jika tidak diisi akan diambil dari faktur)',
    example: 300000,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Jumlah pembayaran harus berupa angka' })
  @IsPositive({ message: 'Jumlah pembayaran harus bernilai positif' })
  amount?: number;

  @ApiPropertyOptional({
    description: 'Data tambahan untuk pembayaran',
    example: { customerName: 'John Doe', customerEmail: 'john@example.com' },
  })
  @IsOptional()
  @IsObject({ message: 'Data tambahan harus berupa objek' })
  metadata?: Record<string, any>;
}