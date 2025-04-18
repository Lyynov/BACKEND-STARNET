
// src/modules/radius/radius.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RadCheck } from './entities/rad-check.entity';
import { RadReply } from './entities/rad-reply.entity';
import { RadUserGroup } from './entities/rad-user-group.entity';
import { RadAcct } from './entities/rad-acct.entity';
import { CreateRadiusUserDto } from './dto/create-radius-user.dto';

@Injectable()
export class RadiusService {
  private readonly logger = new Logger(RadiusService.name);

  constructor(
    @InjectRepository(RadCheck)
    private radCheckRepository: Repository<RadCheck>,
    @InjectRepository(RadReply)
    private radReplyRepository: Repository<RadReply>,
    @InjectRepository(RadUserGroup)
    private radUserGroupRepository: Repository<RadUserGroup>,
    @InjectRepository(RadAcct)
    private radAcctRepository: Repository<RadAcct>,
    private configService: ConfigService,
  ) {}

  async createUser(createRadiusUserDto: CreateRadiusUserDto): Promise<any> {
    const { username, password, attributes, userGroups } = createRadiusUserDto;

    // Create user password entry in radcheck
    const radCheck = this.radCheckRepository.create({
      username,
      attribute: 'Cleartext-Password',
      op: ':=',
      value: password,
    });

    await this.radCheckRepository.save(radCheck);

    // Create attributes in radreply if provided
    if (attributes && attributes.length > 0) {
      const radReplies = attributes.map(attr => 
        this.radReplyRepository.create({
          username,
          attribute: attr.name,
          op: ':=',
          value: attr.value,
        })
      );

      await this.radReplyRepository.save(radReplies);
    }

    // Assign user to groups if provided
    if (userGroups && userGroups.length > 0) {
      const userGroupEntries = userGroups.map((groupName, index) => 
        this.radUserGroupRepository.create({
          username,
          groupname: groupName,
          priority: index + 1,
        })
      );

      await this.radUserGroupRepository.save(userGroupEntries);
    }

    this.logger.log(`Created RADIUS user: ${username}`);
    return { username, created: true };
  }

  async findAllUsers(page: number = 1, limit: number = 10): Promise<any> {
    const [users, total] = await this.radCheckRepository.findAndCount({
      where: { attribute: 'Cleartext-Password' },
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

  async deleteUser(username: string): Promise<any> {
    // Delete from radcheck
    await this.radCheckRepository.delete({ username });
    
    // Delete from radreply
    await this.radReplyRepository.delete({ username });
    
    // Delete from radusergroup
    await this.radUserGroupRepository.delete({ username });

    this.logger.log(`Deleted RADIUS user: ${username}`);
    return { username, deleted: true };
  }

  async getActiveSessions(): Promise<any> {
    return this.radAcctRepository.find({
      where: { acctstoptime: null }, // Only active sessions
    });
  }
}