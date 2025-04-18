
// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Star Access ISP Management API is running';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: this.formatBytes(process.memoryUsage().rss),
    };
  }

  getInfo() {
    return {
      name: 'Star Access ISP Management API',
      version: '1.0.0',
      description: 'Backend API for Star Access ISP Management System',
      environment: this.configService.get('NODE_ENV', 'development'),
      system: {
        platform: os.platform(),
        release: os.release(),
        uptime: this.formatUptime(os.uptime()),
        totalMemory: this.formatBytes(os.totalmem()),
        freeMemory: this.formatBytes(os.freemem()),
        cpus: os.cpus().length,
      },
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }
}