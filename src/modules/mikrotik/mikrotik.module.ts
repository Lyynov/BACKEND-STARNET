import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MikrotikService } from './mikrotik.service';
import { MikrotikController } from './mikrotik.controller';
import { Router } from './entities/router.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Router]),
    ConfigModule,
  ],
  controllers: [MikrotikController],
  providers: [MikrotikService],
  exports: [MikrotikService],
})
export class MikrotikModule {}