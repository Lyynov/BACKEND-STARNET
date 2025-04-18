
// src/modules/monitoring/entities/traffic-data.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('traffic_data')
export class TrafficData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  routerId: string;

  @Column()
  routerName: string;

  @Column()
  interfaceName: string;

  @Column({ type: 'bigint' })
  rxBytes: number;

  @Column({ type: 'bigint' })
  txBytes: number;

  @Column({ type: 'bigint' })
  rxPackets: number;

  @Column({ type: 'bigint' })
  txPackets: number;

  @CreateDateColumn()
  timestamp: Date;
}

// src/modules/monitoring/dto/date-range.dto.ts
import { IsDateString, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}