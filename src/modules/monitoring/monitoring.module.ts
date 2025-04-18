// src/modules/monitoring/monitoring.module.ts
import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { MikrotikModule } from '../mikrotik/mikrotik.module';
import { PPPoEModule } from '../pppoe/pppoe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceUsage } from './entities/resource-usage.entity';
import { TrafficData } from './entities/traffic-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceUsage, TrafficData]),
    MikrotikModule,
    PPPoEModule,
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}


