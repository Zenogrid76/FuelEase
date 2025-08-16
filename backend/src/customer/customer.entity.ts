import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true, length: 15 })
  phoneNo: string;

  @Column({ default: 'customer' })
  role: string;

  // 2FA-related fields
  @Column({ nullable: true, type: 'varchar', length: 255 })
  twoFactorEmail?: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  twoFactorOtp?: string;

  @Column({ nullable: true, type: 'timestamp' })
  twoFactorOtpExpiration?: Date;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
