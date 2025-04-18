// src/modules/users/dto/update-user.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nama lengkap pengguna',
    example: 'John Doe Updated',
  })
  @IsOptional()
  @IsString({ message: 'Nama lengkap harus berupa string' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Alamat email pengguna',
    example: 'john.updated@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Password baru',
    example: 'NewStrongP@ssw0rd',
  })
  @IsOptional()
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Peran pengguna dalam sistem',
    example: 'manager',
    enum: ['admin', 'staff', 'manager'],
  })
  @IsOptional()
  @IsEnum(['admin', 'staff', 'manager'], { message: 'Peran harus salah satu dari: admin, staff, manager' })
  role?: string;

  @ApiPropertyOptional({
    description: 'Nomor telepon pengguna',
    example: '08123456789',
  })
  @IsOptional()
  @IsString({ message: 'Nomor telepon harus berupa string' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Status aktif pengguna',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  isActive?: boolean;
}