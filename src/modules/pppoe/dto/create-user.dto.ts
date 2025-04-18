// src/modules/pppoe/dto/create-user.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username untuk koneksi PPPoE',
    example: 'user123',
  })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString({ message: 'Username harus berupa string' })
  @Matches(/^[a-zA-Z0-9._-]{3,30}$/, {
    message: 'Username hanya boleh terdiri dari huruf, angka, dan karakter . _ -',
  })
  username: string;

  @ApiProperty({
    description: 'Password untuk koneksi PPPoE',
    example: 'strong-password',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  password: string;

  @ApiProperty({
    description: 'ID profil PPPoE',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID profil tidak boleh kosong' })
  @IsString({ message: 'ID profil harus berupa string' })
  profileId: string;

  @ApiPropertyOptional({
    description: 'ID pelanggan terkait',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString({ message: 'ID pelanggan harus berupa string' })
  customerId?: string;

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
    description: 'Apakah pengguna berasal dari voucher',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Flag voucher harus berupa boolean' })
  isVoucher?: boolean;

  @ApiPropertyOptional({
    description: 'Tanggal masa berlaku',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDate({ message: 'Tanggal masa berlaku harus berupa tanggal yang valid' })
  @Type(() => Date)
  validUntil?: Date;

  @ApiPropertyOptional({
    description: 'Status aktif',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Komentar atau catatan',
    example: 'Pelanggan: John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Komentar harus berupa string' })
  comment?: string;
}