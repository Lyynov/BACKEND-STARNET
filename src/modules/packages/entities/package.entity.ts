
// src/modules/packages/entities/package.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  downloadSpeed: string;

  @Column()
  uploadSpeed: string;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ default: 30 })
  validityDays: number;

  @Column({ nullable: true })
  dataLimit: number; // in MB, null means unlimited

  @Column({ nullable: true })
  additionalFeatures: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  pppoeProfileId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}