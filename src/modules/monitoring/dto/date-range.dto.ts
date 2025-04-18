// src/modules/monitoring/dto/date-range.dto.ts
import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Tanggal mulai untuk rentang waktu (format ISO 8601)',
    example: '2025-04-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal mulai tidak valid' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Tanggal akhir untuk rentang waktu (format ISO 8601)',
    example: '2025-04-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal akhir tidak valid' })
  endDate?: string;
}