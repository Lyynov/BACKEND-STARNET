// src/modules/radius/entities/rad-acct.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radacct')
export class RadAcct {
  @PrimaryGeneratedColumn()
  radacctid: number;

  @Column()
  acctsessionid: string;

  @Column()
  acctuniqueid: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  realm: string;

  @Column({ nullable: true })
  nasipaddress: string;

  @Column({ nullable: true })
  nasportid: string;

  @Column({ nullable: true })
  nasporttype: string;

  @Column({ type: 'timestamp', nullable: true })
  acctstarttime: Date;

  @Column({ type: 'timestamp', nullable: true })
  acctupdatetime: Date;

  @Column({ type: 'timestamp', nullable: true })
  acctstoptime: Date;

  @Column({ nullable: true, default: 0 })
  acctinterval: number;

  @Column({ nullable: true, default: 0 })
  acctsessiontime: number;

  @Column({ nullable: true })
  acctauthentic: string;

  @Column({ nullable: true })
  connectinfo_start: string;

  @Column({ nullable: true })
  connectinfo_stop: string;

  @Column({ nullable: true, type: 'bigint', default: 0 })
  acctinputoctets: number;

  @Column({ nullable: true, type: 'bigint', default: 0 })
  acctoutputoctets: number;

  @Column({ nullable: true })
  calledstationid: string;

  @Column({ nullable: true })
  callingstationid: string;

  @Column({ nullable: true })
  acctterminatecause: string;

  @Column({ nullable: true })
  servicetype: string;

  @Column({ nullable: true })
  framedprotocol: string;

  @Column({ nullable: true })
  framedipaddress: string;
}