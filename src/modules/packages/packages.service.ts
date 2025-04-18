
// src/modules/packages/packages.service.ts
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Package } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PPPoEService } from '../pppoe/pppoe.service';

@Injectable()
export class PackagesService {
  private readonly logger = new Logger(PackagesService.name);

  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
    private pppoeService: PPPoEService,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    // Check if PPPoE profile exists
    await this.pppoeService.findProfileById(createPackageDto.pppoeProfileId);
    
    // Check if package name already exists
    const existingPackage = await this.packagesRepository.findOne({
      where: { name: createPackageDto.name },
    });
    
    if (existingPackage) {
      throw new BadRequestException(`Package with name ${createPackageDto.name} already exists`);
    }
    
    const package_ = this.packagesRepository.create(createPackageDto);
    const savedPackage = await this.packagesRepository.save(package_);
    
    this.logger.log(`Created package: ${savedPackage.name} (${savedPackage.id})`);
    return savedPackage;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<any> {
    const queryBuilder = this.packagesRepository.createQueryBuilder('package');
    
    if (search) {
      queryBuilder.where(
        '(package.name LIKE :search OR package.description LIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    queryBuilder
      .orderBy('package.price', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [packages, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: packages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findActive(): Promise<Package[]> {
    return this.packagesRepository.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    });
  }

  async findById(id: string): Promise<Package> {
    const package_ = await this.packagesRepository.findOne({ where: { id } });
    
    if (!package_) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    
    return package_;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package> {
    const package_ = await this.findById(id);
    
    // If PPPoE profile is changing, verify it exists
    if (updatePackageDto.pppoeProfileId && 
        updatePackageDto.pppoeProfileId !== package_.pppoeProfileId) {
      await this.pppoeService.findProfileById(updatePackageDto.pppoeProfileId);
    }
    
    // If name is changing, check if it already exists
    if (updatePackageDto.name && updatePackageDto.name !== package_.name) {
      const existingPackage = await this.packagesRepository.findOne({
        where: { name: updatePackageDto.name },
      });
      
      if (existingPackage) {
        throw new BadRequestException(`Package with name ${updatePackageDto.name} already exists`);
      }
    }
    
    // Update package properties
    Object.assign(package_, updatePackageDto);
    
    const updatedPackage = await this.packagesRepository.save(package_);
    this.logger.log(`Updated package: ${package_.name} (${package_.id})`);
    
    return updatedPackage;
  }

  async remove(id: string): Promise<void> {
    const package_ = await this.findById(id);
    
    // TODO: Check if package is in use by any customers before allowing deletion
    
    await this.packagesRepository.remove(package_);
    this.logger.log(`Removed package: ${package_.name} (${package_.id})`);
  }
}