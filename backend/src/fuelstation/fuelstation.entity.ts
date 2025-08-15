import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Admin } from '../admin/admin.entity';

@Entity('fuelstations')
export class FuelStation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Admin, admin => admin.id)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @Column()
  adminId: number;

  @CreateDateColumn()
  createdAt: Date;
}
