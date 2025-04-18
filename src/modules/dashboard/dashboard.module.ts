// src/modules/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { BillingModule } from '../billing/billing.module';
import { CustomersModule } from '../customers/customers.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { PPPoEModule } from '../pppoe/pppoe.module';
import { MikrotikModule } from '../mikrotik/mikrotik.module';

@Module({
  imports: [
    BillingModule,
    CustomersModule,
    VouchersModule,
    PPPoEModule,
    MikrotikModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
