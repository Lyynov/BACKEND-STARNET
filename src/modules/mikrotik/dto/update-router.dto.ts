// src/modules/mikrotik/dto/update-router.dto.ts
import { IsString, IsOptional, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRouterDto {
  @ApiPropertyOptional({
    description: 'Nama router',
    example: 'Router-Pusat-Baru',
  })
  @IsOptional()
  @IsString({ message: 'Nama router harus berupa string' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Alamat IP router',
    example: '192.168.1.2',
  })
  @IsOptional()
  @IsString({ message: 'Alamat IP harus berupa string' })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Username untuk mengakses API router',
    example: 'admin2',
  })
  @IsOptional()
  @IsString({ message: 'Username harus berupa string' })
  username?: string;

  @ApiPropertyOptional({
    description: 'Password untuk mengakses API router',
    example: 'new-strong-password',
  })
  @IsOptional()
  @IsString({ message: 'Password harus berupa string' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Port API router',
    example: 8729,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Port API harus berupa angka' })
  @IsPositive({ message: 'Port API harus bernilai positif' })
  @Min(1, { message: 'Port API minimal 1' })
  @Max(65535, { message: 'Port API maksimal 65535' })
  apiPort?: number;

  @ApiPropertyOptional({
    description: 'Deskripsi router',
    example: 'Router utama untuk kantor pusat yang baru',
  })
  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  description?: string;
}