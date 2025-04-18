// src/modules/payment-gateway/dto/payment-query.dto.ts
import { IsOptional, IsString, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../shared/dtos/pagination-query.dto';

export class PaymentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'ID faktur',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Format ID faktur tidak valid' })
  invoiceId?: string;

  @ApiPropertyOptional({
    description: 'ID pelanggan',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Format ID pelanggan tidak valid' })
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Kode penyedia pembayaran',
    example: 'nicepay',
  })
  @IsOptional()
  @IsString({ message: 'Kode penyedia pembayaran harus berupa string' })
  providerCode?: string;

  @ApiPropertyOptional({
    description: 'Kode metode pembayaran',
    example: 'va_bca',
  })
  @IsOptional()
  @IsString({ message: 'Kode metode pembayaran harus berupa string' })
  methodCode?: string;

  @ApiPropertyOptional({
    description: 'Status transaksi',
    example: 'success',
    enum: ['pending', 'success', 'failed', 'expired', 'canceled'],
  })
  @IsOptional()
  @IsEnum(['pending', 'success', 'failed', 'expired', 'canceled'], {
    message: 'Status harus salah satu dari: pending, success, failed, expired, canceled',
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Tanggal mulai (format: ISO 8601)',
    example: '2025-04-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal mulai tidak valid' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Tanggal akhir (format: ISO 8601)',
    example: '2025-04-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal akhir tidak valid' })
  endDate?: string;
}