// src/modules/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { BillingModule } from '../billing/billing.module';
import { CustomersModule } from '../customers/customers.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { PPPoEModule } from '../pppoe/pppoe.module';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [
    BillingModule,
    CustomersModule,
    VouchersModule,
    PPPoEModule,
    MonitoringModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
