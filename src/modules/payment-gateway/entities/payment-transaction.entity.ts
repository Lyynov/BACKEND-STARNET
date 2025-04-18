// src/modules/payment-gateway/entities/payment-transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  referenceNumber: string; // Nomor referensi internal (dihasilkan oleh sistem kita)

  @Column({ nullable: true })
  @Index()
  invoiceId: string; // ID faktur yang dibayar

  @Column({ nullable: true })
  customerId: string; // ID pelanggan

  @Column()
  providerCode: string; // Kode provider (nicepay, duitku, dll.)

  @Column()
  methodCode: string; // Kode metode pembayaran (va_bca, gopay, dll.)

  @Column({ nullable: true })
  @Index()
  externalId: string; // ID transaksi dari payment gateway

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number; // Jumlah pembayaran

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number; // Biaya transaksi

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number; // Total (amount + fee)

  @Column({ default: 'pending' })
  @Index()
  status: string; // 'pending', 'success', 'failed', 'expired', 'canceled'

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date; // Tanggal kadaluarsa pembayaran

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date; // Tanggal pembayaran berhasil

  @Column({ type: 'timestamp', nullable: true })
  canceledAt: Date; // Tanggal pembayaran dibatalkan

  @Column({ type: 'jsonb', nullable: true })
  paymentDetails: Record<string, any>; // Detail pembayaran (nomor VA, checkout URL, dll.)

  @Column({ type: 'jsonb', nullable: true })
  callbackData: Record<string, any>; // Data callback dari payment gateway

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Metadata tambahan

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}