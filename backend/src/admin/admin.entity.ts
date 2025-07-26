import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins') 
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nidNumber: string;

  @Column({ nullable: true })
  nidImage?: string; 

  @Column()
  phoneNo: string;
}
