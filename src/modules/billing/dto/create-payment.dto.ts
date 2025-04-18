// src/modules/billing/dto/create-payment.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive, Min, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID faktur yang akan dibayar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID faktur tidak boleh kosong' })
  @IsString({ message: 'ID faktur harus berupa string' })
  invoiceId: string;

  @ApiProperty({
    description: 'Jumlah pembayaran',
    example: 300000,
  })
  @IsNotEmpty({ message: 'Jumlah pembayaran tidak boleh kosong' })
  @IsNumber({}, { message: 'Jumlah pembayaran harus berupa angka' })
  @IsPositive({ message: 'Jumlah pembayaran harus bernilai positif' })
  @Min(1, { message: 'Jumlah pembayaran minimal 1' })
  amount: number;

  @ApiProperty({
    description: 'Metode pembayaran',
    example: 'bank_transfer',
    enum: ['cash', 'bank_transfer', 'e_wallet', 'credit_card', 'other'],
  })
  @IsNotEmpty({ message: 'Metode pembayaran tidak boleh kosong' })
  @IsEnum(['cash', 'bank_transfer', 'e_wallet', 'credit_card', 'other'], {
    message: 'Metode pembayaran harus salah satu dari: cash, bank_transfer, e_wallet, credit_card, other',
  })
  paymentMethod: string;

  @ApiPropertyOptional({
    description: 'Referensi atau nomor bukti pembayaran',
    example: 'TRX123456789',
  })
  @IsOptional()
  @IsString({ message: 'Nomor referensi harus berupa string' })
  referenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Catatan tambahan untuk pembayaran',
    example: 'Pembayaran untuk bulan Januari 2025',
  })
  @IsOptional()
  @IsString({ message: 'Catatan harus berupa string' })
  note?: string;
}