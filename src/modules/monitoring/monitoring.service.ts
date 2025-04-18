
// src/modules/monitoring/monitoring.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ResourceUsage } from './entities/resource-usage.entity';
import { TrafficData } from './entities/traffic-data.entity';
import { MikrotikService } from '../mikrotik/mikrotik.service';
import { PPPoEService } from '../pppoe/pppoe.service';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    @InjectRepository(ResourceUsage)
    private resourceRepository: Repository<ResourceUsage>,
    @InjectRepository(TrafficData)
    private trafficRepository: Repository<TrafficData>,
    private mikrotikService: MikrotikService,
    private pppoeService: PPPoEService,
  ) {}

  async getSystemResources(): Promise<any> {
    try {
      const routers = await this.mikrotikService.findAllRouters();
      const routerResources = [];
      
      for (const router of routers) {
        try {
          const resources = await this.mikrotikService.getRouterStatistics(router.id);
          
          // Save to database for historical data
          const resourceUsage = this.resourceRepository.create({
            routerId: router.id,
            routerName: router.name,
            cpuUsage: resources.cpu,
            memoryTotal: resources.memory.total,
            memoryUsed: resources.memory.used,
            diskTotal: 0, // Would need to be fetched from router
            diskUsed: 0, // Would need to be fetched from router
            activePPPoESessions: 0, // Would need to be fetched from router
          });
          
          await this.resourceRepository.save(resourceUsage);
          
          routerResources.push({
            id: router.id,
            name: router.name,
            cpu: resources.cpu,
            memory: resources.memory,
            uptime: resources.uptime,
            version: resources.version,
            temperature: resources.temperature,
          });
        } catch (error) {
          this.logger.error(`Failed to get resources for router ${router.name}: ${error.message}`);
          routerResources.push({
            id: router.id,
            name: router.name,
            status: 'offline',
            error: error.message,
          });
        }
      }
      
      return {
        timestamp: new Date(),
        routers: routerResources,
      };
    } catch (error) {
      this.logger.error(`Failed to get system resources: ${error.message}`);
      throw new Error(`Failed to get system resources: ${error.message}`);
    }
  }

  async getResourcesHistory(startDate?: string, endDate?: string): Promise<any> {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to last 24 hours
    const end = endDate ? new Date(endDate) : new Date();
    
    const resources = await this.resourceRepository.find({
      where: {
        timestamp: Between(start, end),
      },
      order: {
        timestamp: 'ASC',
      },
    });
    
    // Group by router
    const routerData = {};
    
    for (const resource of resources) {
      if (!routerData[resource.routerId]) {
        routerData[resource.routerId] = {
          name: resource.routerName,
          data: [],
        };
      }
      
      routerData[resource.routerId].data.push({
        timestamp: resource.timestamp,
        cpu: resource.cpuUsage,
        memory: {
          total: resource.memoryTotal,
          used: resource.memoryUsed,
          usagePercent: (resource.memoryUsed / resource.memoryTotal) * 100,
        },
        disk: {
          total: resource.diskTotal,
          used: resource.diskUsed,
          usagePercent: (resource.diskUsed / resource.diskTotal) * 100,
        },
        activeSessions: resource.activePPPoESessions,
      });
    }
    
    return {
      startDate: start,
      endDate: end,
      routers: Object.values(routerData),
    };
  }

  async getCurrentTraffic(): Promise<any> {
    try {
      const routers = await this.mikrotikService.findAllRouters();
      const trafficData = [];
      
      for (const router of routers) {
        try {
          // This method would need to be implemented in MikrotikService
          // const interfaces = await this.mikrotikService.getInterfaces(router.id);
          
          // For now, we'll just add a placeholder
          trafficData.push({
            id: router.id,
            name: router.name,
            interfaces: [
              {
                name: 'ether1',
                rxBytes: 1000000,
                txBytes: 500000,
                rxPackets: 5000,
                txPackets: 2500,
              },
            ],
          });
        } catch (error) {
          this.logger.error(`Failed to get traffic for router ${router.name}: ${error.message}`);
        }
      }
      
      return {
        timestamp: new Date(),
        traffic: trafficData,
      };
    } catch (error) {
      this.logger.error(`Failed to get current traffic: ${error.message}`);
      throw new Error(`Failed to get current traffic: ${error.message}`);
    }
  }

  async getTrafficHistory(startDate?: string, endDate?: string): Promise<any> {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to last 24 hours
    const end = endDate ? new Date(endDate) : new Date();
    
    const trafficData = await this.trafficRepository.find({
      where: {
        timestamp: Between(start, end),
      },
      order: {
        timestamp: 'ASC',
      },
    });
    
    // Group by router and interface
    const routerData = {};
    
    for (const traffic of trafficData) {
      if (!routerData[traffic.routerId]) {
        routerData[traffic.routerId] = {
          name: traffic.routerName,
          interfaces: {},
        };
      }
      
      if (!routerData[traffic.routerId].interfaces[traffic.interfaceName]) {
        routerData[traffic.routerId].interfaces[traffic.interfaceName] = [];
      }
      
      routerData[traffic.routerId].interfaces[traffic.interfaceName].push({
        timestamp: traffic.timestamp,
        rxBytes: traffic.rxBytes,
        txBytes: traffic.txBytes,
        rxPackets: traffic.rxPackets,
        txPackets: traffic.txPackets,
      });
    }
    
    return {
      startDate: start,
      endDate: end,
      routers: Object.values(routerData).map(router => ({
        name: router.name,
        interfaces: Object.entries(router.interfaces).map(([name, data]) => ({
          name,
          data,
        })),
      })),
    };
  }

  async getActivePPPoESessions(): Promise<any> {
    return this.pppoeService.getAllActiveSessions();
  }

  async getUserBandwidthUsage(username: string, startDate?: string, endDate?: string): Promise<any> {
    // This would typically be implemented by querying RADIUS accounting data
    // For now, we'll return a placeholder
    
    return {
      username,
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate || new Date(),
      totalDownload: 1000000, // bytes
      totalUpload: 500000, // bytes
      dailyUsage: [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          download: 300000,
          upload: 150000,
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          download: 400000,
          upload: 200000,
        },
        {
          date: new Date(),
          download: 300000,
          upload: 150000,
        },
      ],
    };
  }

  // This method would be called by a scheduled job to collect and store traffic data
  async collectTrafficData(): Promise<void> {
    try {
      const routers = await this.mikrotikService.findAllRouters();
      
      for (const router of routers) {
        try {
          // This method would need to be implemented in MikrotikService
          // const interfaces = await this.mikrotikService.getInterfaces(router.id);
          
          // For each interface, store traffic data
          // for (const iface of interfaces) {
          //   const trafficData = this.trafficRepository.create({
          //     routerId: router.id,
          //     routerName: router.name,
          //     interfaceName: iface.name,
          //     rxBytes: iface.rxBytes,
          //     txBytes: iface.txBytes,
          //     rxPackets: iface.rxPackets,
          //     txPackets: iface.txPackets,
          //   });
          //   
          //   await this.trafficRepository.save(trafficData);
          // }
        } catch (error) {
          this.logger.error(`Failed to collect traffic data for router ${router.name}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to collect traffic data: ${error.message}`);
    }
  }
}