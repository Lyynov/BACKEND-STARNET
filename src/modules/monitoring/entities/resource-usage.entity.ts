
// src/modules/monitoring/entities/resource-usage.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('resource_usage')
export class ResourceUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  routerId: string;

  @Column()
  routerName: string;

  @Column({ type: 'float' })
  cpuUsage: number;

  @Column({ type: 'int' })
  memoryTotal: number;

  @Column({ type: 'int' })
  memoryUsed: number;

  @Column({ type: 'int' })
  diskTotal: number;

  @Column({ type: 'int' })
  diskUsed: number;

  @Column({ type: 'int' })
  activePPPoESessions: number;

  @CreateDateColumn()
  timestamp: Date;
}
