// src/modules/packages/packages.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Package } from './entities/package.entity';
import { PPPoEModule } from '../pppoe/pppoe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Package]),
    PPPoEModule,
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}



