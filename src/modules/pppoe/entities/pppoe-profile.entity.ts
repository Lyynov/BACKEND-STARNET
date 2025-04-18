// src/modules/pppoe/entities/pppoe-profile.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PPPoEUser } from './pppoe-user.entity';

@Entity('pppoe_profiles')
export class PPPoEProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  rateLimit: string; // Format: 'DownloadLimit/UploadLimit', contoh: '10M/2M'

  @Column({ nullable: true })
  addressPool: string;

  @Column({ default: true })
  localAddress: string;

  @Column({ nullable: true })
  remoteAddress: string;

  @Column({ nullable: true })
  dns1: string;

  @Column({ nullable: true })
  dns2: string;

  @Column({ default: 'pppoe' })
  service: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => PPPoEUser, user => user.profile)
  users: PPPoEUser[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}