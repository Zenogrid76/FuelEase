import { Entity,
   PrimaryGeneratedColumn,
    Column, 
    ManyToOne, 
    JoinColumn } from 'typeorm';
import { Operator } from '../operator/operator.entity';

@Entity('fuel_stations')
export class FuelStation {
  @PrimaryGeneratedColumn()
  id: number;

 @Column({ type: 'varchar', length: 50 })
fuelType: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' ,nullable: true })
  price: number;

  @Column({ type: 'enum', enum: ['available', 'unavailable'], default: 'available' })
  status: 'available' | 'unavailable';

  @ManyToOne(() => Operator, operator => operator.id)
 @JoinColumn({ name: 'operatorid' })
 operator: Operator;

}
