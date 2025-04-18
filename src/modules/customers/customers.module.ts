// src/modules/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { PPPoEModule } from '../pppoe/pppoe.module';
import { RadiusModule } from '../radius/radius.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PPPoEModule,
    RadiusModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}





