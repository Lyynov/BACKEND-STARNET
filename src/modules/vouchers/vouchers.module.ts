// src/modules/vouchers/vouchers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { Voucher } from './entities/voucher.entity';
import { PPPoEModule } from '../pppoe/pppoe.module';
import { RadiusModule } from '../radius/radius.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Voucher]),
    PPPoEModule,
    RadiusModule,
  ],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
