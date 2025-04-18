// src/modules/radius/dto/create-radius-user.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class RadiusAttributeDto {
  @ApiProperty({
    description: 'Nama atribut RADIUS',
    example: 'Framed-IP-Address',
  })
  @IsNotEmpty({ message: 'Nama atribut tidak boleh kosong' })
  @IsString({ message: 'Nama atribut harus berupa string' })
  name: string;

  @ApiProperty({
    description: 'Nilai atribut RADIUS',
    example: '192.168.1.100',
  })
  @IsNotEmpty({ message: 'Nilai atribut tidak boleh kosong' })
  @IsString({ message: 'Nilai atribut harus berupa string' })
  value: string;
}

export class CreateRadiusUserDto {
  @ApiProperty({
    description: 'Username untuk RADIUS',
    example: 'user123',
  })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString({ message: 'Username harus berupa string' })
  username: string;

  @ApiProperty({
    description: 'Password untuk RADIUS',
    example: 'strong-password',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  password: string;

  @ApiPropertyOptional({
    description: 'Atribut tambahan untuk RADIUS',
    type: [RadiusAttributeDto],
  })
  @IsOptional()
  @IsArray({ message: 'Atribut harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => RadiusAttributeDto)
  attributes?: RadiusAttributeDto[];

  @ApiPropertyOptional({
    description: 'Grup pengguna RADIUS',
    example: ['premium', 'staff'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Grup pengguna harus berupa array' })
  @IsString({ each: true, message: 'Setiap grup harus berupa string' })
  userGroups?: string[];
}