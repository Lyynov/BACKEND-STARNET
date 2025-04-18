
// src/modules/customers/dto/create-customer.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

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

  @IsNotEmpty()
  @IsString()
  packageId: string;

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