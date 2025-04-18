// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { MikrotikModule } from './modules/mikrotik/mikrotik.module';
import { RadiusModule } from './modules/radius/radius.module';
import { PPPoEModule } from './modules/pppoe/pppoe.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { BillingModule } from './modules/billing/billing.module';
import { PackagesModule } from './modules/packages/packages.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { JobsModule } from './jobs/jobs.module';
import { PaymentGatewayModule } from './modules/payment-gateway/payment-gateway.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_DATABASE', 'star_access'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
      }),
    }),
    
    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLE_TTL', 60),
        limit: configService.get<number>('THROTTLE_LIMIT', 100),
      }),
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    CustomersModule,
    MikrotikModule,
    RadiusModule,
    PPPoEModule,
    VouchersModule,
    BillingModule,
    PackagesModule,
    MonitoringModule,
    ReportsModule,
    DashboardModule,
    JobsModule,
    PaymentGatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}