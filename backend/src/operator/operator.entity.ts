import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  
} from 'typeorm';

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;
  
 @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;
  
   @Column({ unique: true, length: 11,type: 'varchar' })
  phoneNo: string;

  @Column({ type: 'varchar' })
  joiningDate: string;

  @Column({ type: 'int', nullable: true })
  age: number;
  
  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Column({ type: 'varchar', length: 100, nullable: true })
  address?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

 @Column({ type: 'varchar', nullable: true })
  profileImage?: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'on_leave'], default: 'active' })
  status: 'active' | 'inactive' | 'on_leave';

  @Column({ default: 'operator' })
  role: string;


}
