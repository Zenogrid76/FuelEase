import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins') 
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Column({ select: false }) // Exclude from select queries
  password: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nidNumber: number;

  @Column({ nullable: true })
  nidImage?: string; 

  @Column()
  phoneNo: number;
}
