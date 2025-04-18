import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Router } from './entities/router.entity';
import { AddRouterDto } from './dto/add-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import * as RouterOSAPI from 'node-routeros';

@Injectable()
export class MikrotikService {
  private readonly logger = new Logger(MikrotikService.name);
  private activeConnections: Map<string, any> = new Map();

  constructor(
    @InjectRepository(Router)
    private routerRepository: Repository<Router>,
    private configService: ConfigService,
  ) {}

  async addRouter(addRouterDto: AddRouterDto): Promise<any> {
    const { name, ipAddress, username, password, apiPort, description } = addRouterDto;

    // Check connection before saving
    try {
      const connection = new RouterOSAPI({
        host: ipAddress,
        user: username,
        password: password,
        port: apiPort || 8728,
      });

      await connection.connect();
      
      // Get system identity and resources for additional info
      const identity = await connection.write('/system/identity/print');
      const resources = await connection.write('/system/resource/print');
      
      connection.close();

      // Create and save router
      const router = this.routerRepository.create({
        name,
        ipAddress,
        username,
        password, // In production, consider encrypting this
        apiPort: apiPort || 8728,
        description,
        model: resources[0]['board-name'] || 'Unknown',
        version: resources[0].version || 'Unknown',
        serialNumber: resources[0]['serial-number'] || 'Unknown',
        identity: identity[0].name || name,
        status: 'online',
      });

      const savedRouter = await this.routerRepository.save(router);
      
      // Remove sensitive info
      const { password: _, ...result } = savedRouter;
      
      this.logger.log(`Added router: ${name} (${ipAddress})`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to connect to router: ${error.message}`);
      throw new Error(`Failed to connect to router: ${error.message}`);
    }
  }

  async findAllRouters(): Promise<any> {
    const routers = await this.routerRepository.find();
    
    // Remove passwords
    return routers.map(router => {
      const { password, ...result } = router;
      return result;
    });
  }

  async getRouterById(id: string): Promise<any> {
    const router = await this.routerRepository.findOne({ where: { id } });
    
    if (!router) {
      throw new NotFoundException(`Router with ID ${id} not found`);
    }
    
    // Remove password
    const { password, ...result } = router;
    return result;
  }

  async updateRouter(id: string, updateRouterDto: UpdateRouterDto): Promise<any> {
    const router = await this.routerRepository.findOne({ where: { id } });
    
    if (!router) {
      throw new NotFoundException(`Router with ID ${id} not found`);
    }

    // Update router properties
    Object.assign(router, updateRouterDto);
    
    // If connection details changed, test connection
    if (updateRouterDto.ipAddress || updateRouterDto.username || 
        updateRouterDto.password || updateRouterDto.apiPort) {
      try {
        const connection = new RouterOSAPI({
          host: router.ipAddress,
          user: router.username,
          password: router.password,
          port: router.apiPort,
        });

        await connection.connect();
        connection.close();
        router.status = 'online';
      } catch (error) {
        router.status = 'offline';
        this.logger.error(`Failed to connect to updated router: ${error.message}`);
      }
    }

    const savedRouter = await this.routerRepository.save(router);
    
    // Remove password
    const { password, ...result } = savedRouter;
    return result;
  }

  async removeRouter(id: string): Promise<void> {
    const router = await this.routerRepository.findOne({ where: { id } });
    
    if (!router) {
      throw new NotFoundException(`Router with ID ${id} not found`);
    }

    await this.routerRepository.remove(router);
    this.logger.log(`Removed router: ${router.name} (${router.ipAddress})`);
  }

  async connectToRouter(routerId: string): Promise<any> {
    const router = await this.routerRepository.findOne({ where: { id: routerId } });
    
    if (!router) {
      throw new NotFoundException(`Router with ID ${routerId} not found`);
    }

    // Check if we already have an active connection
    if (this.activeConnections.has(routerId)) {
      try {
        // Test if connection is still active
        const conn = this.activeConnections.get(routerId);
        await conn.write('/system/identity/print');
        return conn;
      } catch (error) {
        // Connection is no longer valid, remove it
        this.activeConnections.delete(routerId);
      }
    }

    // Create new connection
    try {
      const connection = new RouterOSAPI({
        host: router.ipAddress,
        user: router.username,
        password: router.password,
        port: router.apiPort,
        timeout: 10000,
      });

      await connection.connect();
      
      // Store the connection
      this.activeConnections.set(routerId, connection);
      
      // Update router status
      router.status = 'online';
      await this.routerRepository.save(router);
      
      return connection;
    } catch (error) {
      // Update router status
      router.status = 'offline';
      await this.routerRepository.save(router);
      
      this.logger.error(`Failed to connect to router: ${error.message}`);
      throw new Error(`Failed to connect to router: ${error.message}`);
    }
  }

  async getPPPoEUsers(routerId: string): Promise<any> {
    const connection = await this.connectToRouter(routerId);
    
    try {
      const pppoeUsers = await connection.write('/ppp/secret/print');
      return pppoeUsers;
    } catch (error) {
      this.logger.error(`Failed to get PPPoE users: ${error.message}`);
      throw new Error(`Failed to get PPPoE users: ${error.message}`);
    }
  }

  async getPPPoEActiveSessions(routerId: string): Promise<any> {
    const connection = await this.connectToRouter(routerId);
    
    try {
      const sessions = await connection.write('/ppp/active/print');
      return sessions;
    } catch (error) {
      this.logger.error(`Failed to get active PPPoE sessions: ${error.message}`);
      throw new Error(`Failed to get active PPPoE sessions: ${error.message}`);
    }
  }

  async addPPPoEUser(routerId: string, userData: any): Promise<any> {
    const connection = await this.connectToRouter(routerId);
    
    try {
      await connection.write('/ppp/secret/add', [
        '=name=' + userData.username,
        '=password=' + userData.password,
        '=profile=' + userData.profile,
        '=service=pppoe',
        ...(userData.localAddress ? ['=local-address=' + userData.localAddress] : []),
        ...(userData.remoteAddress ? ['=remote-address=' + userData.remoteAddress] : []),
        ...(userData.comment ? ['=comment=' + userData.comment] : []),
      ]);
      
      this.logger.log(`Added PPPoE user: ${userData.username}`);
      return { username: userData.username, added: true };
    } catch (error) {
      this.logger.error(`Failed to add PPPoE user: ${error.message}`);
      throw new Error(`Failed to add PPPoE user: ${error.message}`);
    }
  }

  async getRouterStatistics(routerId: string): Promise<any> {
    const connection = await this.connectToRouter(routerId);
    
    try {
      const resources = await connection.write('/system/resource/print');
      const health = await connection.write('/system/health/print');
      
      return {
        cpu: resources[0]['cpu-load'],
        memory: {
          total: parseInt(resources[0]['total-memory']),
          free: parseInt(resources[0]['free-memory']),
          used: parseInt(resources[0]['total-memory']) - parseInt(resources[0]['free-memory']),
        },
        uptime: resources[0].uptime,
        version: resources[0].version,
        boardName: resources[0]['board-name'],
        temperature: health[0]?.temperature || 'N/A',
      };
    } catch (error) {
      this.logger.error(`Failed to get router statistics: ${error.message}`);
      throw new Error(`Failed to get router statistics: ${error.message}`);
    }
  }
}