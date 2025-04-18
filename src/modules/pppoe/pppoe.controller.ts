// src/modules/pppoe/pppoe.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { PPPoEService } from './pppoe.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../shared/dtos/pagination-query.dto';

@ApiTags('pppoe')
@ApiBearerAuth()
@Controller('pppoe')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PPPoEController {
  constructor(private readonly pppoeService: PPPoEService) {}

  /* Profil PPPoE */
  @ApiOperation({ summary: 'Membuat profil PPPoE baru' })
  @ApiResponse({ status: 201, description: 'Profil berhasil dibuat' })
  @Post('profiles')
  @Roles('admin')
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.pppoeService.createProfile(createProfileDto);
  }

  @ApiOperation({ summary: 'Mendapatkan semua profil PPPoE' })
  @ApiResponse({ status: 200, description: 'Daftar profil PPPoE' })
  @Get('profiles')
  @Roles('admin', 'staff')
  async findAllProfiles() {
    return this.pppoeService.findAllProfiles();
  }

  @ApiOperation({ summary: 'Mendapatkan profil PPPoE berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail profil PPPoE' })
  @ApiResponse({ status: 404, description: 'Profil tidak ditemukan' })
  @Get('profiles/:id')
  @Roles('admin', 'staff')
  async findProfileById(@Param('id') id: string) {
    return this.pppoeService.findProfileById(id);
  }

  @ApiOperation({ summary: 'Memperbarui profil PPPoE' })
  @ApiResponse({ status: 200, description: 'Profil berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Profil tidak ditemukan' })
  @Put('profiles/:id')
  @Roles('admin')
  async updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.pppoeService.updateProfile(id, updateProfileDto);
  }

  @ApiOperation({ summary: 'Menghapus profil PPPoE' })
  @ApiResponse({ status: 200, description: 'Profil berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Profil tidak ditemukan' })
  @Delete('profiles/:id')
  @Roles('admin')
  async removeProfile(@Param('id') id: string) {
    return this.pppoeService.removeProfile(id);
  }

  /* Pengguna PPPoE */
  @ApiOperation({ summary: 'Membuat pengguna PPPoE baru' })
  @ApiResponse({ status: 201, description: 'Pengguna berhasil dibuat' })
  @Post('users')
  @Roles('admin', 'staff')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.pppoeService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Mendapatkan semua pengguna PPPoE' })
  @ApiResponse({ status: 200, description: 'Daftar pengguna PPPoE' })
  @Get('users')
  @Roles('admin', 'staff')
  async findAllUsers(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    return this.pppoeService.findAllUsers(page, limit);
  }

  @ApiOperation({ summary: 'Mendapatkan pengguna PPPoE berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail pengguna PPPoE' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  @Get('users/:id')
  @Roles('admin', 'staff')
  async findUserById(@Param('id') id: string) {
    return this.pppoeService.findUserById(id);
  }

  @ApiOperation({ summary: 'Memperbarui pengguna PPPoE' })
  @ApiResponse({ status: 200, description: 'Pengguna berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  @Put('users/:id')
  @Roles('admin', 'staff')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.pppoeService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Menghapus pengguna PPPoE' })
  @ApiResponse({ status: 200, description: 'Pengguna berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  @Delete('users/:id')
  @Roles('admin', 'staff')
  async removeUser(@Param('id') id: string) {
    return this.pppoeService.removeUser(id);
  }

  /* Sesi Aktif PPPoE */
  @ApiOperation({ summary: 'Mendapatkan semua sesi aktif' })
  @ApiResponse({ status: 200, description: 'Daftar sesi aktif' })
  @Get('sessions')
  @Roles('admin', 'staff')
  async getAllActiveSessions() {
    return this.pppoeService.getAllActiveSessions();
  }
}