import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Sale } from '../../sales/entities/sale.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  // ROLE
  @Column({
    default: 'empleado',
  })
  role!: string;

  // STATUS
  @Column({
    default: 'activo',
  })
  status!: string;

  @OneToMany(
    () => Sale,
    sale => sale.user,
  )
  sales!: Sale[];
}