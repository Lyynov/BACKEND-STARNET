// src/modules/radius/entities/rad-check.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radcheck')
export class RadCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  attribute: string;

  @Column()
  op: string;

  @Column()
  value: string;
}