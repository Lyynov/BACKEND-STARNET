
// src/jobs/jobs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { BillingService } from '../modules/billing/billing.service';
import { VouchersService } from '../modules/vouchers/vouchers.service';
import { MonitoringService } from '../modules/monitoring/monitoring.service';
import { MikrotikService } from '../modules/mikrotik/mikrotik.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private billingService: BillingService,
    private vouchersService: VouchersService,
    private monitoringService: MonitoringService,
    private mikrotikService: MikrotikService,
  ) {}

  @Timeout(10000)
  async handleStartup() {
    this.logger.log('Application started, running initial tasks...');
    
    try {
      // Check router connections
      await this.checkRouterConnections();
      
      // Process expired vouchers
      await this.processExpiredVouchers();
      
      // Update overdue invoices
      await this.updateOverdueInvoices();
      
      this.logger.log('Initial tasks completed successfully');
    } catch (error) {
      this.logger.error(`Error in startup tasks: ${error.message}`);
    }
  }

  // Run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyTasks() {
    this.logger.log('Running daily scheduled tasks...');
    
    try {
      // Process expired vouchers
      await this.processExpiredVouchers();
      
      // Update overdue invoices
      await this.updateOverdueInvoices();
      
      this.logger.log('Daily tasks completed successfully');
    } catch (error) {
      this.logger.error(`Error in daily tasks: ${error.message}`);
    }
  }

  // Run every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyTasks() {
    this.logger.log('Running hourly scheduled tasks...');
    
    try {
      // Check router connections
      await this.checkRouterConnections();
      
      // Collect system resource data
      await this.collectResourceData();
      
      this.logger.log('Hourly tasks completed successfully');
    } catch (error) {
      this.logger.error(`Error in hourly tasks: ${error.message}`);
    }
  }

  // Run every 5 minutes
  @Cron('*/5 * * * *')
  async handleFrequentTasks() {
    this.logger.debug('Running frequent scheduled tasks...');
    
    try {
      // Collect traffic data
      await this.collectTrafficData();
      
      this.logger.debug('Frequent tasks completed successfully');
    } catch (error) {
      this.logger.error(`Error in frequent tasks: ${error.message}`);
    }
  }

  // Run at 1:00 AM every Sunday
  @Cron('0 1 * * 0')
  async handleWeeklyTasks() {
    this.logger.log('Running weekly scheduled tasks...');
    
    try {
      // Any weekly maintenance tasks
      
      this.logger.log('Weekly tasks completed successfully');
    } catch (error) {
      this.logger.error(`Error in weekly tasks: ${error.message}`);
    }
  }

  // Run at 2:00 AM on the first day of every month
  @Cron('0 2 1 * *')
  async handleMonthlyTasks() {
    this.logger.log('Running monthly scheduled tasks...');
    
    try {
      // Generate monthly invoices
      // This would be implemented in BillingService
      
      this.logger.log('Monthly tasks completed successfully');
    } catch (error) {
      this.logger.error(`Error in monthly tasks: ${error.message}`);
    }
  }

  private async checkRouterConnections() {
    try {
      const routers = await this.mikrotikService.findAllRouters();
      
      for (const router of routers) {
        try {
          await this.mikrotikService.getRouterStatistics(router.id);
          this.logger.debug(`Successfully connected to router: ${router.name}`);
        } catch (error) {
          this.logger.warn(`Failed to connect to router ${router.name}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error checking router connections: ${error.message}`);
    }
  }

  private async processExpiredVouchers() {
    try {
      const expiredCount = await this.vouchersService.processExpiredVouchers();
      this.logger.log(`Processed expired vouchers: ${expiredCount} vouchers marked as expired`);
    } catch (error) {
      this.logger.error(`Error processing expired vouchers: ${error.message}`);
    }
  }

  private async updateOverdueInvoices() {
    try {
      const updatedCount = await this.billingService.updateOverdueInvoices();
      this.logger.log(`Updated overdue invoices: ${updatedCount} invoices marked as overdue`);
    } catch (error) {
      this.logger.error(`Error updating overdue invoices: ${error.message}`);
    }
  }

  private async collectResourceData() {
    try {
      await this.monitoringService.getSystemResources();
      this.logger.debug('Collected system resource data');
    } catch (error) {
      this.logger.error(`Error collecting resource data: ${error.message}`);
    }
  }

  private async collectTrafficData() {
    try {
      await this.monitoringService.collectTrafficData();
      this.logger.debug('Collected traffic data');
    } catch (error) {
      this.logger.error(`Error collecting traffic data: ${error.message}`);
    }
  }
}