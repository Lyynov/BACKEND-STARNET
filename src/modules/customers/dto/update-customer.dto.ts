
// src/modules/customers/dto/update-customer.dto.ts
import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  identityNumber?: string;

  @IsOptional()
  @IsString()
  identityType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validUntil?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}