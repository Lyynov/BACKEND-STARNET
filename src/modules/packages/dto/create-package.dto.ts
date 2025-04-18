
// src/modules/packages/dto/create-package.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min, IsPositive } from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  downloadSpeed: string;

  @IsNotEmpty()
  @IsString()
  uploadSpeed: string;

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

  @IsNotEmpty()
  @IsString()
  pppoeProfileId: string;
}