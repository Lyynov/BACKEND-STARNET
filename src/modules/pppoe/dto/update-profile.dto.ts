// src/modules/pppoe/dto/update-profile.dto.ts
import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Batas kecepatan download/upload',
    example: '20M/5M',
  })
  @IsOptional()
  @IsString({ message: 'Batas kecepatan harus berupa string' })
  @Matches(/^\d+[kKmMgG][bB]?\/\d+[kKmMgG][bB]?$/, {
    message: 'Format batas kecepatan tidak valid. Contoh: 10M/2M',
  })
  rateLimit?: string;

  @ApiPropertyOptional({
    description: 'Pool alamat IP',
    example: 'premium-pool',
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
    example: '1.1.1.1',
  })
  @IsOptional()
  @IsString({ message: 'DNS Server 1 harus berupa string' })
  dns1?: string;

  @ApiPropertyOptional({
    description: 'DNS Server 2',
    example: '1.0.0.1',
  })
  @IsOptional()
  @IsString({ message: 'DNS Server 2 harus berupa string' })
  dns2?: string;

  @ApiPropertyOptional({
    description: 'Status aktif',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Deskripsi profil',
    example: 'Profil untuk paket Premium 20 Mbps',
  })
  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  description?: string;
}