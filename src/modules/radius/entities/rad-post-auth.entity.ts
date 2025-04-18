// src/modules/radius/entities/rad-post-auth.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radpostauth')
export class RadPostAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  pass: string;

  @Column()
  reply: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  authdate: Date;
}