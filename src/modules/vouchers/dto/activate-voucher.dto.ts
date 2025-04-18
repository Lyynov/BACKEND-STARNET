// src/modules/vouchers/dto/activate-voucher.dto.ts
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateVoucherDto {
  @ApiProperty({
    description: 'Kode voucher yang akan diaktifkan',
    example: 'STR-1A2B3C4D',
  })
  @IsNotEmpty({ message: 'Kode voucher tidak boleh kosong' })
  @IsString({ message: 'Kode voucher harus berupa string' })
  code: string;

  @ApiProperty({
    description: 'Username yang akan digunakan untuk layanan PPPoE',
    example: 'user123',
  })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString({ message: 'Username harus berupa string' })
  @Matches(/^[a-zA-Z0-9._-]{3,30}$/, {
    message: 'Username hanya boleh terdiri dari huruf, angka, dan karakter . _ -',
  })
  username: string;
}