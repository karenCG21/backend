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

  @Column({
    default: 'empleado',
  })
  role!: string;

  @Column({
    default: 'activo',
  })
  status!: string;

  @Column({
    nullable: true,
  })
  resetToken!: string;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  resetTokenExpires!: Date;

  @OneToMany(
    () => Sale,
    sale => sale.user,
  )
  sales!: Sale[];
}