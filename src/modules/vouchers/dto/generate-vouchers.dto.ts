// src/modules/vouchers/dto/generate-vouchers.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateVouchersDto {
  @ApiProperty({
    description: 'Jumlah voucher yang akan digenerate',
    example: 10,
  })
  @IsNotEmpty({ message: 'Jumlah voucher tidak boleh kosong' })
  @IsNumber({}, { message: 'Jumlah voucher harus berupa angka' })
  @IsPositive({ message: 'Jumlah voucher harus bernilai positif' })
  @Min(1, { message: 'Jumlah voucher minimal 1' })
  count: number;

  @ApiProperty({
    description: 'ID profil PPPoE yang akan digunakan',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID profil PPPoE tidak boleh kosong' })
  @IsString({ message: 'ID profil PPPoE harus berupa string' })
  profileId: string;

  @ApiProperty({
    description: 'Masa berlaku voucher dalam hari',
    example: 30,
  })
  @IsNotEmpty({ message: 'Masa berlaku voucher tidak boleh kosong' })
  @IsNumber({}, { message: 'Masa berlaku voucher harus berupa angka' })
  @IsPositive({ message: 'Masa berlaku voucher harus bernilai positif' })
  @Min(1, { message: 'Masa berlaku voucher minimal 1 hari' })
  validityDays: number;

  @ApiProperty({
    description: 'Harga per voucher',
    example: 50000,
  })
  @IsNotEmpty({ message: 'Harga voucher tidak boleh kosong' })
  @IsNumber({}, { message: 'Harga voucher harus berupa angka' })
  @IsPositive({ message: 'Harga voucher harus bernilai positif' })
  pricePerVoucher: number;

  @ApiPropertyOptional({
    description: 'Awalan (prefix) untuk kode voucher',
    example: 'STR-',
  })
  @IsOptional()
  @IsString({ message: 'Awalan voucher harus berupa string' })
  prefix?: string;
}