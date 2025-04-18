// src/modules/billing/entities/invoice.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from './payment.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  customerId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  @Column()
  status: string; // 'unpaid', 'paid', 'overdue', 'canceled'

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ nullable: true })
  note: string;

  @OneToMany(() => InvoiceItem, item => item.invoice, { cascade: true })
  items: InvoiceItem[];

  @OneToMany(() => Payment, payment => payment.invoice)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}