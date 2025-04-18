// src/modules/pppoe/pppoe.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPPoEService } from './pppoe.service';
import { PPPoEController } from './pppoe.controller';
import { PPPoEProfile } from './entities/pppoe-profile.entity';
import { PPPoEUser } from './entities/pppoe-user.entity';
import { MikrotikModule } from '../mikrotik/mikrotik.module';
import { RadiusModule } from '../radius/radius.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PPPoEProfile, PPPoEUser]),
    MikrotikModule,
    RadiusModule,
  ],
  controllers: [PPPoEController],
  providers: [PPPoEService],
  exports: [PPPoEService],
})
export class PPPoEModule {}

