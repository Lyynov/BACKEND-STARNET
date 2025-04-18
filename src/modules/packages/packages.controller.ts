
// src/modules/packages/packages.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../shared/dtos/pagination-query.dto';

@ApiTags('Packages')
@ApiBearerAuth()
@Controller('packages')
@UseGuards(JwtAuthGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @ApiOperation({ summary: 'Create a new package' })
  @ApiResponse({ status: 201, description: 'Package successfully created' })
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @ApiOperation({ summary: 'Get all packages' })
  @ApiResponse({ status: 200, description: 'Return all packages' })
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    return this.packagesService.findAll(page, limit, search);
  }

  @ApiOperation({ summary: 'Get active packages' })
  @ApiResponse({ status: 200, description: 'Return active packages' })
  @Get('active')
  async findActive() {
    return this.packagesService.findActive();
  }

  @ApiOperation({ summary: 'Get a package by ID' })
  @ApiResponse({ status: 200, description: 'Return the package' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.packagesService.findById(id);
  }

  @ApiOperation({ summary: 'Update a package' })
  @ApiResponse({ status: 200, description: 'Package successfully updated' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(id, updatePackageDto);
  }

  @ApiOperation({ summary: 'Delete a package' })
  @ApiResponse({ status: 200, description: 'Package successfully deleted' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}