// src/modules/mikrotik/dto/add-router.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddRouterDto {
  @ApiProperty({
    description: 'Nama router',
    example: 'Router-Pusat',
  })
  @IsNotEmpty({ message: 'Nama router tidak boleh kosong' })
  @IsString({ message: 'Nama router harus berupa string' })
  name: string;

  @ApiProperty({
    description: 'Alamat IP router',
    example: '192.168.1.1',
  })
  @IsNotEmpty({ message: 'Alamat IP tidak boleh kosong' })
  @IsString({ message: 'Alamat IP harus berupa string' })
  ipAddress: string;

  @ApiProperty({
    description: 'Username untuk mengakses API router',
    example: 'admin',
  })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString({ message: 'Username harus berupa string' })
  username: string;

  @ApiProperty({
    description: 'Password untuk mengakses API router',
    example: 'strong-password',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  password: string;

  @ApiPropertyOptional({
    description: 'Port API router (default: 8728)',
    example: 8728,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Port API harus berupa angka' })
  @IsPositive({ message: 'Port API harus bernilai positif' })
  @Min(1, { message: 'Port API minimal 1' })
  @Max(65535, { message: 'Port API maksimal 65535' })
  apiPort?: number;

  @ApiPropertyOptional({
    description: 'Deskripsi router',
    example: 'Router utama untuk kantor pusat',
  })
  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  description?: string;
}