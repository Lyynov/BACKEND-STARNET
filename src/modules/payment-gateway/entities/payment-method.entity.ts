// src/modules/payment-gateway/entities/payment-method.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentProvider } from './payment-provider.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  providerId: string;

  @Column()
  code: string; // 'va_bca', 'va_mandiri', 'credit_card', 'gopay', dll.

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  feeFlat: number; // Biaya tetap (misal: Rp 4.000)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  feePercent: number; // Biaya persentase (misal: 2.5%)

  @Column({ default: 'customer' })
  feeChargedTo: string; // 'customer' atau 'merchant'

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalConfig: Record<string, any>; // Konfigurasi tambahan khusus metode pembayaran

  @ManyToOne(() => PaymentProvider, provider => provider.paymentMethods)
  @JoinColumn({ name: 'providerId' })
  provider: PaymentProvider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}