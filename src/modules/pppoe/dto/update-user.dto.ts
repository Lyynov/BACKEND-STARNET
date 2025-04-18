// src/modules/pppoe/dto/update-user.dto.ts
import { IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Password untuk koneksi PPPoE',
    example: 'new-strong-password',
  })
  @IsOptional()
  @IsString({ message: 'Password harus berupa string' })
  password?: string;

  @ApiPropertyOptional({
    description: 'ID profil PPPoE',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString({ message: 'ID profil harus berupa string' })
  profileId?: string;

  @ApiPropertyOptional({
    description: 'Alamat IP yang ditetapkan',
    example: '192.168.1.100',
  })
  @IsOptional()
  @IsString({ message: 'Alamat IP harus berupa string' })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Alamat IP lokal router',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString({ message: 'Alamat IP lokal harus berupa string' })
  localAddress?: string;

  @ApiPropertyOptional({
    description: 'Tanggal masa berlaku',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDate({ message: 'Tanggal masa berlaku harus berupa tanggal yang valid' })
  @Type(() => Date)
  validUntil?: Date;

  @ApiPropertyOptional({
    description: 'Status aktif',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Komentar atau catatan',
    example: 'Pelanggan: John Doe - Alamat Baru',
  })
  @IsOptional()
  @IsString({ message: 'Komentar harus berupa string' })
  comment?: string;
}