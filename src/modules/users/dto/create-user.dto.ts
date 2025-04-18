// src/modules/users/dto/create-user.dto.ts
import { IsNotEmpty, IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username untuk login',
    example: 'johndoe',
  })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString({ message: 'Username harus berupa string' })
  username: string;

  @ApiProperty({
    description: 'Password untuk login',
    example: 'StrongP@ssw0rd',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({
    description: 'Nama lengkap pengguna',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  @IsString({ message: 'Nama lengkap harus berupa string' })
  fullName: string;

  @ApiProperty({
    description: 'Alamat email pengguna',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({
    description: 'Peran pengguna dalam sistem',
    example: 'staff',
    enum: ['admin', 'staff', 'manager'],
  })
  @IsNotEmpty({ message: 'Peran tidak boleh kosong' })
  @IsEnum(['admin', 'staff', 'manager'], { message: 'Peran harus salah satu dari: admin, staff, manager' })
  role: string;

  @ApiPropertyOptional({
    description: 'Nomor telepon pengguna',
    example: '08123456789',
  })
  @IsOptional()
  @IsString({ message: 'Nomor telepon harus berupa string' })
  phone?: string;
}