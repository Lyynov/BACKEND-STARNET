// src/modules/radius/entities/rad-reply.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radreply')
export class RadReply {
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