// src/modules/pppoe/dto/create-profile.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    description: 'Nama profil PPPoE',
    example: 'Premium_10M',
  })
  @IsNotEmpty({ message: 'Nama profil tidak boleh kosong' })
  @IsString({ message: 'Nama profil harus berupa string' })
  name: string;

  @ApiProperty({
    description: 'Batas kecepatan download/upload',
    example: '10M/2M',
  })
  @IsNotEmpty({ message: 'Batas kecepatan tidak boleh kosong' })
  @IsString({ message: 'Batas kecepatan harus berupa string' })
  @Matches(/^\d+[kKmMgG][bB]?\/\d+[kKmMgG][bB]?$/, {
    message: 'Format batas kecepatan tidak valid. Contoh: 10M/2M',
  })
  rateLimit: string;

  @ApiPropertyOptional({
    description: 'Pool alamat IP',
    example: 'pppoe-pool',
  })
  @IsOptional()
  @IsString({ message: 'Pool alamat IP harus berupa string' })
  addressPool?: string;

  @ApiPropertyOptional({
    description: 'Alamat IP lokal router',
    example: '10.0.0.1',
  })
  @IsOptional()
  @IsString({ message: 'Alamat IP lokal harus berupa string' })
  localAddress?: string;

  @ApiPropertyOptional({
    description: 'Alamat IP jarak jauh',
    example: '10.0.0.0/24',
  })
  @IsOptional()
  @IsString({ message: 'Alamat IP jarak jauh harus berupa string' })
  remoteAddress?: string;

  @ApiPropertyOptional({
    description: 'DNS Server 1',
    example: '8.8.8.8',
  })
  @IsOptional()
  @IsString({ message: 'DNS Server 1 harus berupa string' })
  dns1?: string;

  @ApiPropertyOptional({
    description: 'DNS Server 2',
    example: '8.8.4.4',
  })
  @IsOptional()
  @IsString({ message: 'DNS Server 2 harus berupa string' })
  dns2?: string;

  @ApiPropertyOptional({
    description: 'Layanan PPP',
    example: 'pppoe',
    default: 'pppoe',
  })
  @IsOptional()
  @IsString({ message: 'Layanan PPP harus berupa string' })
  service?: string;

  @ApiPropertyOptional({
    description: 'Status aktif',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Deskripsi profil',
    example: 'Profil untuk paket Premium 10 Mbps',
  })
  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  description?: string;
}