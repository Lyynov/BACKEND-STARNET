import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RadiusService } from './radius.service';
import { RadiusController } from './radius.controller';
import { RadCheck } from './entities/rad-check.entity';
import { RadReply } from './entities/rad-reply.entity';
import { RadUserGroup } from './entities/rad-user-group.entity';
import { RadPostAuth } from './entities/rad-post-auth.entity';
import { RadAcct } from './entities/rad-acct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RadCheck,
      RadReply,
      RadUserGroup,
      RadPostAuth,
      RadAcct
    ]),
    ConfigModule,
  ],
  controllers: [RadiusController],
  providers: [RadiusService],
  exports: [RadiusService],
})
export class RadiusModule {}