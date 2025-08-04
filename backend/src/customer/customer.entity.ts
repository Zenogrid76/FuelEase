import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'boolean', default: false })
  isActve: boolean;

  @BeforeInsert()
  generateId() {
    this.id =  Math.round(Math.random() * 1e5);
  }
}
