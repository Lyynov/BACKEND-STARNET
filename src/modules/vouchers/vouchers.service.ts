import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { GenerateVouchersDto } from './dto/generate-vouchers.dto';
import { ActivateVoucherDto } from './dto/activate-voucher.dto';
import { PPPoEService } from '../pppoe/pppoe.service';
import { RadiusService } from '../radius/radius.service';
import * as crypto from 'crypto';

@Injectable()
export class VouchersService {
  private readonly logger = new Logger(VouchersService.name);

  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    private pppoeService: PPPoEService,
    private radiusService: RadiusService,
  ) {}

  async generateVouchers(generateVouchersDto: GenerateVouchersDto): Promise<any> {
    const { count, profileId, validityDays, pricePerVoucher, prefix = '' } = generateVouchersDto;
    
    // Verify that profile exists
    await this.pppoeService.findProfileById(profileId);
    
    const vouchers: Voucher[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate random code
      const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
      const code = `${prefix}${randomBytes}`;
      
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90); // Vouchers expire after 90 days if not used
      
      const voucher = this.voucherRepository.create({
        code,
        profileId,
        validityDays,
        price: pricePerVoucher,
        status: 'unused',
        expiryDate,
      });
      
      vouchers.push(voucher);
    }
    
    const savedVouchers = await this.voucherRepository.save(vouchers);
    
    this.logger.log(`Generated ${count} vouchers for profile ID: ${profileId}`);
    return {
      generatedCount: savedVouchers.length,
      vouchers: savedVouchers,
    };
  }

  async findAllVouchers(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<any> {
    const where = status ? { status } : {};
    
    const [vouchers, total] = await this.voucherRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: vouchers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findVoucherByCode(code: string): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({ where: { code } });
    
    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${code} not found`);
    }
    
    return voucher;
  }

  async activateVoucher(activateVoucherDto: ActivateVoucherDto): Promise<any> {
    const { code, username } = activateVoucherDto;
    
    // Find voucher
    const voucher = await this.findVoucherByCode(code);
    
    // Check if voucher is unused
    if (voucher.status !== 'unused') {
      throw new BadRequestException(`Voucher is already ${voucher.status}`);
    }
    
    // Check if voucher is expired
    if (new Date() > voucher.expiryDate) {
      voucher.status = 'expired';
      await this.voucherRepository.save(voucher);
      throw new BadRequestException('Voucher has expired');
    }
    
    // Get profile
    const profile = await this.pppoeService.findProfileById(voucher.profileId);
    
    // Create temp password
    const password = crypto.randomBytes(4).toString('hex');
    
    // Create PPPoE user
    await this.pppoeService.createUser({
      username,
      password,
      profileId: voucher.profileId,
      isVoucher: true,
      validUntil: new Date(Date.now() + voucher.validityDays * 86400000), // Convert days to ms
    });
    
    // Update voucher status
    voucher.status = 'used';
    voucher.usedBy = username;
    voucher.usedAt = new Date();
    await this.voucherRepository.save(voucher);
    
    this.logger.log(`Activated voucher ${code} for user ${username}`);
    
    return {
      success: true,
      message: 'Voucher activated successfully',
      username,
      password, // In production, handle this carefully
      validityDays: voucher.validityDays,
      profile: profile.name,
    };
  }

  async processExpiredVouchers(): Promise<number> {
    const currentDate = new Date();
    
    const result = await this.voucherRepository.update(
      {
        status: 'unused',
        expiryDate: LessThan(currentDate),
      },
      {
        status: 'expired',
      }
    );
    
    this.logger.log(`Marked ${result.affected} vouchers as expired`);
    return result.affected || 0;
  }

  async getVoucherStats(): Promise<any> {
    const totalCount = await this.voucherRepository.count();
    const unusedCount = await this.voucherRepository.count({ where: { status: 'unused' } });
    const usedCount = await this.voucherRepository.count({ where: { status: 'used' } });
    const expiredCount = await this.voucherRepository.count({ where: { status: 'expired' } });
    
    // Calculate revenue from used vouchers
    const usedVouchers = await this.voucherRepository.find({ where: { status: 'used' } });
    const revenue = usedVouchers.reduce((sum, voucher) => sum + voucher.price, 0);
    
    return {
      total: totalCount,
      unused: unusedCount,
      used: usedCount,
      expired: expiredCount,
      revenue,
    };
  }
}