// src/modules/billing/entities/payment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column()
  paymentMethod: string; // 'cash', 'bank_transfer', 'e_wallet', 'credit_card', 'other'

  @Column({ nullable: true })
  referenceNumber: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'timestamp' })
  paidAt: Date;

  @Column({ nullable: true })
  processedBy: string; // ID pengguna yang memproses pembayaran

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Invoice, invoice => invoice.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}