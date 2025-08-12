import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true,  })
  profileImage?: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, length: 10 })
  nidNumber: string;

  @Column({ nullable: true })
  nidImage?: string;

  @Column({ type: 'int', unsigned: true })
  age: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: 'active' | 'inactive';

  @Column({ unique: true, length: 11 })
  phoneNo: string;

  @Column({ default: 'admin' })
  role: string ; 

  @Column({ default: false })
isTwoFactorEnabled: boolean;

@Column({ nullable: true })
twoFactorEmail?: string | null;


@Column({ nullable: true })
twoFactorOtp?: string;

@Column({ type: 'timestamp', nullable: true })
twoFactorOtpExpiration?: Date;


}
