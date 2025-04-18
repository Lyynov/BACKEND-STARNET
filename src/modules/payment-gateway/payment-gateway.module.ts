// src/modules/payment-gateway/payment-gateway.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayController } from './payment-gateway.controller';
import { NicepayService } from './providers/nicepay.service';
import { DuitkuService } from './providers/duitku.service';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentProvider } from './entities/payment-provider.entity';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentTransaction,
      PaymentMethod,
      PaymentProvider
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 15000,
        maxRedirects: 5,
      }),
    }),
    ConfigModule,
    BillingModule,
  ],
  controllers: [PaymentGatewayController],
  providers: [
    PaymentGatewayService,
    NicepayService,
    DuitkuService,
  ],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {}