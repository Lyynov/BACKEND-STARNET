
// src/modules/customers/customers.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../shared/dtos/pagination-query.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer successfully created' })
  @Post()
  @Roles('admin', 'staff')
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers' })
  @Get()
  @Roles('admin', 'staff')
  async findAll(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10, search, status } = query;
    return this.customersService.findAll(page, limit, search, status);
  }

  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, description: 'Return the customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Get(':id')
  @Roles('admin', 'staff')
  async findById(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully updated' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Put(':id')
  @Roles('admin', 'staff')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully deleted' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @ApiOperation({ summary: 'Suspend a customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully suspended' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Post(':id/suspend')
  @Roles('admin', 'staff')
  async suspend(@Param('id') id: string) {
    return this.customersService.changeStatus(id, 'suspended');
  }

  @ApiOperation({ summary: 'Activate a customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully activated' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Post(':id/activate')
  @Roles('admin', 'staff')
  async activate(@Param('id') id: string) {
    return this.customersService.changeStatus(id, 'active');
  }

  @ApiOperation({ summary: 'Get customer statistics' })
  @ApiResponse({ status: 200, description: 'Return customer statistics' })
  @Get('stats/summary')
  @Roles('admin', 'staff')
  async getCustomerStats() {
    return this.customersService.getCustomerStats();
  }
}