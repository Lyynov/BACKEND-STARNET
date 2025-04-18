
// src/modules/packages/dto/update-package.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsPositive } from 'class-validator';

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  downloadSpeed?: string;

  @IsOptional()
  @IsString()
  uploadSpeed?: string;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  validityDays?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  dataLimit?: number;

  @IsOptional()
  @IsString()
  additionalFeatures?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  pppoeProfileId?: string;
}
