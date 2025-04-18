// src/modules/payment-gateway/entities/payment-provider.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

@Entity('payment_providers')
export class PaymentProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // 'nicepay', 'duitku', dll.

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>; // Konfigurasi provider (merchantId, apiKey, dll.)

  @Column({ type: 'jsonb', nullable: true })
  endpoints: Record<string, string>; // URL endpoints API

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => PaymentMethod, method => method.provider)
  paymentMethods: PaymentMethod[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}