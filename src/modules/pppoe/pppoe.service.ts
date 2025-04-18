// src/modules/pppoe/pppoe.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PPPoEProfile } from './entities/pppoe-profile.entity';
import { PPPoEUser } from './entities/pppoe-user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { MikrotikService } from '../mikrotik/mikrotik.service';
import { RadiusService } from '../radius/radius.service';

@Injectable()
export class PPPoEService {
  private readonly logger = new Logger(PPPoEService.name);

  constructor(
    @InjectRepository(PPPoEProfile)
    private profileRepository: Repository<PPPoEProfile>,
    @InjectRepository(PPPoEUser)
    private userRepository: Repository<PPPoEUser>,
    private mikrotikService: MikrotikService,
    private radiusService: RadiusService,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<PPPoEProfile> {
    const profile = this.profileRepository.create(createProfileDto);
    return this.profileRepository.save(profile);
  }

  async findAllProfiles(): Promise<PPPoEProfile[]> {
    return this.profileRepository.find();
  }

  async findProfileById(id: string): Promise<PPPoEProfile> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    
    if (!profile) {
      throw new NotFoundException(`PPPoE profile with ID ${id} not found`);
    }
    
    return profile;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<PPPoEProfile> {
    const profile = await this.findProfileById(id);
    
    // Update profile properties
    Object.assign(profile, updateProfileDto);
    
    return this.profileRepository.save(profile);
  }

  async removeProfile(id: string): Promise<void> {
    const profile = await this.findProfileById(id);
    await this.profileRepository.remove(profile);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    // Check if profile exists
    const profile = await this.profileRepository.findOne({ 
      where: { id: createUserDto.profileId } 
    });
    
    if (!profile) {
      throw new NotFoundException(`PPPoE profile with ID ${createUserDto.profileId} not found`);
    }

    // Create user in database
    const user = this.userRepository.create({
      ...createUserDto,
      profile,
    });
    
    const savedUser = await this.userRepository.save(user);

    // Create user in RADIUS
    await this.radiusService.createUser({
      username: createUserDto.username,
      password: createUserDto.password,
      attributes: [
        { name: 'Service-Type', value: 'Framed-User' },
        { name: 'Framed-Protocol', value: 'PPP' },
        { name: 'Framed-IP-Address', value: createUserDto.ipAddress || '' },
        { name: 'Mikrotik-Rate-Limit', value: profile.rateLimit },
      ],
      userGroups: [profile.name],
    });

    // Add user to all routers
    const routers = await this.mikrotikService.findAllRouters();
    
    for (const router of routers) {
      try {
        await this.mikrotikService.addPPPoEUser(router.id, {
          username: createUserDto.username,
          password: createUserDto.password,
          profile: profile.name,
          localAddress: createUserDto.localAddress,
          remoteAddress: createUserDto.ipAddress,
          comment: createUserDto.comment,
        });
      } catch (error) {
        this.logger.error(`Failed to add user to router ${router.name}: ${error.message}`);
        // Continue with other routers even if one fails
      }
    }

    this.logger.log(`Created PPPoE user: ${createUserDto.username}`);
    return savedUser;
  }

  async findAllUsers(page: number = 1, limit: number = 10): Promise<any> {
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['profile'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUserById(id: string): Promise<PPPoEUser> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException(`PPPoE user with ID ${id} not found`);
    }
    
    return user;
  }

  async updateUser(id: string, updateUserDto: any): Promise<PPPoEUser> {
    const user = await this.findUserById(id);
    
    // If profile is changed, verify it exists
    if (updateUserDto.profileId && updateUserDto.profileId !== user.profileId) {
      const profile = await this.profileRepository.findOne({ 
        where: { id: updateUserDto.profileId } 
      });
      
      if (!profile) {
        throw new NotFoundException(`PPPoE profile with ID ${updateUserDto.profileId} not found`);
      }
      
      user.profile = profile;
    }
    
    // Update user properties
    Object.assign(user, updateUserDto);
    
    const savedUser = await this.userRepository.save(user);

    // Update user in RADIUS if needed
    // (Implementation depends on what fields can be updated)

    this.logger.log(`Updated PPPoE user: ${user.username}`);
    return savedUser;
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.findUserById(id);
    
    // Remove from RADIUS
    await this.radiusService.deleteUser(user.username);
    
    // Remove from routers
    const routers = await this.mikrotikService.findAllRouters();
    
    for (const router of routers) {
      try {
        // Implementation would depend on how your Mikrotik service is set up
        // This is a placeholder
        // await this.mikrotikService.removePPPoEUser(router.id, user.username);
      } catch (error) {
        this.logger.error(`Failed to remove user from router ${router.name}: ${error.message}`);
      }
    }
    
    // Remove from database
    await this.userRepository.remove(user);
    this.logger.log(`Removed PPPoE user: ${user.username}`);
  }

  async getAllActiveSessions(): Promise<any> {
    // Get active sessions from RADIUS
    const radiusSessions = await this.radiusService.getActiveSessions();
    
    // Get active sessions from routers
    const routers = await this.mikrotikService.findAllRouters();
    let routerSessions = [];
    
    for (const router of routers) {
      try {
        const sessions = await this.mikrotikService.getPPPoEActiveSessions(router.id);
        routerSessions = [...routerSessions, ...sessions.map(session => ({
          ...session,
          routerId: router.id,
          routerName: router.name,
        }))];
      } catch (error) {
        this.logger.error(`Failed to get sessions from router ${router.name}: ${error.message}`);
      }
    }
    
    // Combine and format sessions
    // This would require more complex logic to match RADIUS and router sessions
    return {
      radiusSessions,
      routerSessions,
    };
  }
}