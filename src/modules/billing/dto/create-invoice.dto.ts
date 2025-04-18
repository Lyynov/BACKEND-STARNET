// src/modules/billing/dto/create-invoice.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsDate, IsArray, ValidateNested, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class InvoiceItemDto {
  @ApiProperty({
    description: 'Deskripsi item yang ditagih',
    example: 'Paket Internet Premium bulan Januari 2025',
  })
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  @IsString({ message: 'Deskripsi harus berupa string' })
  description: string;

  @ApiProperty({
    description: 'Jumlah biaya item',
    example: 300000,
  })
  @IsNotEmpty({ message: 'Jumlah biaya tidak boleh kosong' })
  @IsNumber({}, { message: 'Jumlah biaya harus berupa angka' })
  @IsPositive({ message: 'Jumlah biaya harus bernilai positif' })
  @Min(0, { message: 'Jumlah biaya tidak boleh negatif' })
  amount: number;

  @ApiPropertyOptional({
    description: 'Keterangan tambahan',
    example: 'Termasuk pajak',
  })
  @IsOptional()
  @IsString({ message: 'Keterangan harus berupa string' })
  note?: string;
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'ID pelanggan yang akan ditagih',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID pelanggan tidak boleh kosong' })
  @IsString({ message: 'ID pelanggan harus berupa string' })
  customerId: string;

  @ApiPropertyOptional({
    description: 'Tanggal jatuh tempo faktur',
    example: '2025-01-31T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate({ message: 'Tanggal jatuh tempo harus berupa tanggal yang valid' })
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({
    description: 'Detail item yang ditagih',
    type: [InvoiceItemDto],
  })
  @IsArray({ message: 'Item harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiPropertyOptional({
    description: 'Catatan tambahan untuk faktur',
    example: 'Silahkan lakukan pembayaran sebelum tanggal jatuh tempo',
  })
  @IsOptional()
  @IsString({ message: 'Catatan harus berupa string' })
  note?: string;
}