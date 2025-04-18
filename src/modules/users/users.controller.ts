// src/modules/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../shared/dtos/pagination-query.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Membuat pengguna baru' })
  @ApiResponse({ status: 201, description: 'Pengguna berhasil dibuat' })
  @Post()
  @Roles('admin')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Mendapatkan semua pengguna' })
  @ApiResponse({ status: 200, description: 'Daftar semua pengguna' })
  @Get()
  @Roles('admin')
  async findAll(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    return this.usersService.findAll(page, limit, search);
  }

  @ApiOperation({ summary: 'Mendapatkan pengguna berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail pengguna' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Memperbarui pengguna' })
  @ApiResponse({ status: 200, description: 'Pengguna berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Menghapus pengguna' })
  @ApiResponse({ status: 200, description: 'Pengguna berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}