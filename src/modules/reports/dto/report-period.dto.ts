
// src/modules/reports/dto/report-period.dto.ts
import { IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class ReportPeriodDto {
  @IsNotEmpty()
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly', 'custom'])
  period: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
