// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BillingModule } from '../modules/billing/billing.module';
import { VouchersModule } from '../modules/vouchers/vouchers.module';
import { MonitoringModule } from '../modules/monitoring/monitoring.module';
import { MikrotikModule } from '../modules/mikrotik/mikrotik.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BillingModule,
    VouchersModule,
    MonitoringModule,
    MikrotikModule,
  ],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
