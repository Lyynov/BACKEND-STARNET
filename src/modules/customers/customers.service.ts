
// src/modules/customers/customers.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PPPoEService } from '../pppoe/pppoe.service';
import { RadiusService } from '../radius/radius.service';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private pppoeService: PPPoEService,
    private radiusService: RadiusService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Get package details from PPPoE service
    const profile = await this.pppoeService.findProfileById(createCustomerDto.packageId);
    
    // Create customer in database
    const customer = this.customersRepository.create({
      ...createCustomerDto,
      packageName: profile.name,
      status: 'active',
    });
    
    const savedCustomer = await this.customersRepository.save(customer);
    
    // Create PPPoE user
    await this.pppoeService.createUser({
      username: createCustomerDto.username,
      password: createCustomerDto.password,
      profileId: createCustomerDto.packageId,
      ipAddress: createCustomerDto.ipAddress,
      customerId: savedCustomer.id,
      comment: `Customer: ${createCustomerDto.fullName}`,
    });
    
    this.logger.log(`Created customer: ${savedCustomer.username} (${savedCustomer.id})`);
    return savedCustomer;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ): Promise<any> {
    const queryBuilder = this.customersRepository.createQueryBuilder('customer');
    
    // Add search condition if provided
    if (search) {
      queryBuilder.where(
        '(customer.fullName LIKE :search OR customer.username LIKE :search OR customer.email LIKE :search OR customer.phone LIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    // Add status filter if provided
    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }
    
    // Add order and pagination
    queryBuilder
      .orderBy('customer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [customers, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findById(id);
    
    // If package is changing, get the new package details
    if (updateCustomerDto.packageId && updateCustomerDto.packageId !== customer.packageId) {
      const profile = await this.pppoeService.findProfileById(updateCustomerDto.packageId);
      updateCustomerDto.packageName = profile.name;
      
      // Update package in RADIUS/PPPoE
      // This would depend on your implementation
    }
    
    // Update customer properties
    Object.assign(customer, updateCustomerDto);
    
    const updatedCustomer = await this.customersRepository.save(customer);
    this.logger.log(`Updated customer: ${customer.username} (${customer.id})`);
    
    return updatedCustomer;
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findById(id);
    
    // Remove from RADIUS/PPPoE
    await this.radiusService.deleteUser(customer.username);
    
    // Remove from database
    await this.customersRepository.remove(customer);
    this.logger.log(`Removed customer: ${customer.username} (${customer.id})`);
  }

  async changeStatus(id: string, status: string): Promise<Customer> {
    const customer = await this.findById(id);
    
    customer.status = status;
    
    // If suspending, disable in RADIUS/Mikrotik
    if (status === 'suspended') {
      // Disable user in RADIUS or Mikrotik
      // Implementation depends on your setup
    }
    
    // If activating, enable in RADIUS/Mikrotik
    if (status === 'active') {
      // Enable user in RADIUS or Mikrotik
      // Implementation depends on your setup
    }
    
    const updatedCustomer = await this.customersRepository.save(customer);
    this.logger.log(`Changed customer status to ${status}: ${customer.username} (${customer.id})`);
    
    return updatedCustomer;
  }

  async getCustomerStats(): Promise<any> {
    const total = await this.customersRepository.count();
    const active = await this.customersRepository.count({ where: { status: 'active' } });
    const suspended = await this.customersRepository.count({ where: { status: 'suspended' } });
    const inactive = await this.customersRepository.count({ where: { status: 'inactive' } });
    
    // Count new customers in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newCustomers = await this.customersRepository.count({
      where: {
        createdAt: MoreThan(thirtyDaysAgo),
      },
    });
    
    return {
      total,
      active,
      suspended,
      inactive,
      newLast30Days: newCustomers,
    };
  }
}