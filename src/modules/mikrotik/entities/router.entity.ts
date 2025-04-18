// src/modules/mikrotik/entities/router.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('routers')
export class Router {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  ipAddress: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 8728 })
  apiPort: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  identity: string;

  @Column({ default: 'offline' })
  status: string; // 'online', 'offline'

  @Column({ type: 'timestamp', nullable: true })
  lastSync: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}