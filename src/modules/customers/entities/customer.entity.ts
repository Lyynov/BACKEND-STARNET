// src/modules/customers/entities/customer.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  identityNumber: string;

  @Column({ nullable: true })
  identityType: string;

  @Column({ default: 'active' })
  status: string; // active, inactive, suspended

  @Column({ nullable: true })
  packageId: string;

  @Column({ nullable: true })
  packageName: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActivity: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}