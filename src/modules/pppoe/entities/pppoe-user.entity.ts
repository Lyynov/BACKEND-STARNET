// src/modules/pppoe/entities/pppoe-user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PPPoEProfile } from './pppoe-profile.entity';

@Entity('pppoe_users')
export class PPPoEUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  profileId: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  localAddress: string;

  @Column({ default: false })
  isVoucher: boolean;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'timestamp', nullable: true })
  lastConnected: Date;

  @ManyToOne(() => PPPoEProfile, profile => profile.users)
  @JoinColumn({ name: 'profileId' })
  profile: PPPoEProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}