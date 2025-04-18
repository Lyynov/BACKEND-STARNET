// src/modules/radius/entities/rad-user-group.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radusergroup')
export class RadUserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  groupname: string;

  @Column({ default: 1 })
  priority: number;
}