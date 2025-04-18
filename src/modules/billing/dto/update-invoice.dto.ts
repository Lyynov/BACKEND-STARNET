// src/modules/billing/dto/update-invoice.dto.ts
import { IsOptional, IsDate, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceItemDto } from './create-invoice.dto';

export class UpdateInvoiceDto {
  @ApiPropertyOptional({
    description: 'Tanggal jatuh tempo faktur',
    example: '2025-01-31T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate({ message: 'Tanggal jatuh tempo harus berupa tanggal yang valid' })
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Detail item yang ditagih',
    type: [InvoiceItemDto],
  })
  @IsOptional()
  @IsArray({ message: 'Item harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items?: InvoiceItemDto[];

  @ApiPropertyOptional({
    description: 'Catatan tambahan untuk faktur',
    example: 'Silahkan lakukan pembayaran sebelum tanggal jatuh tempo',
  })
  @IsOptional()
  @IsString({ message: 'Catatan harus berupa string' })
  note?: string;
}

export { InvoiceItemDto } from './create-invoice.dto';