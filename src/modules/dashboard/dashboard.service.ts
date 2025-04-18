
// src/modules/dashboard/dashboard.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { BillingService } from '../billing/billing.service';
import { CustomersService } from '../customers/customers.service';
import { VouchersService } from '../vouchers/vouchers.service';
import { PPPoEService } from '../pppoe/pppoe.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private billingService: BillingService,
    private customersService: CustomersService,
    private vouchersService: VouchersService,
    private pppoeService: PPPoEService,
    private mikrotikService: MikrotikService,
  ) {}

  async getDashboardStats(): Promise<any> {
    try {
      // Get billing stats
      const billingStats = await this.billingService.getBillingStats();
      
      // Get customer stats
      const customerStats = await this.customersService.getCustomerStats();
      
      // Get voucher stats
      const voucherStats = await this.vouchersService.getVoucherStats();
      
      // Get active PPPoE sessions
      const activeSessions = await this.pppoeService.getAllActiveSessions();
      
      // Get router stats
      const routers = await this.mikrotikService.findAllRouters();
      const routerStats = await Promise.all(
        routers.map(async router => {
          try {
            return await this.mikrotikService.getRouterStatistics(router.id);
          } catch (error) {
            this.logger.error(`Failed to get stats for router ${router.name}: ${error.message}`);
            return {
              id: router.id,
              name: router.name,
              status: 'offline',
            };
          }
        })
      );
      
      return {
        billing: {
          dailyIncome: billingStats.totalRevenue / 30, // Approximate daily income
          unpaidInvoices: billingStats.unpaidInvoices + billingStats.overdueInvoices,
          totalRevenue: billingStats.totalRevenue,
          outstandingAmount: billingStats.outstandingAmount,
        },
        customers: {
          total: customerStats.total,
          active: customerStats.active,
          pppoe: customerStats.active, // All active customers use PPPoE
          newLast30Days: customerStats.newLast30Days,
        },
        vouchers: {
          total: voucherStats.total,
          unused: voucherStats.unused,
          used: voucherStats.used,
          expired: voucherStats.expired,
          revenue: voucherStats.revenue,
        },
        sessions: {
          activePPPoE: activeSessions.routerSessions.length,
        },
        system: {
          routers: routerStats,
          onlineRouters: routerStats.filter(r => r.status !== 'offline').length,
          totalRouters: routers.length,
        }
      };
    } catch (error) {
      this.logger.error(`Failed to get dashboard stats: ${error.message}`);
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }
}
