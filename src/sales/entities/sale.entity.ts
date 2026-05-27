import {  Column,  CreateDateColumn,  Entity,  ManyToOne,  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { SaleDetail } from '../../sale_details/entities/sale_detail.entity';
 
@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  total!: number;
  @CreateDateColumn()
  createdAt!: Date;
  @ManyToOne(
    () => User,
    user => user.sales,
    {
      eager: true,
    },
  )
  user!: User;
  @OneToMany(
    () => SaleDetail,
    detail => detail.sale,
    {
      cascade: true,
      eager: true,
    },
  )
  details!: SaleDetail[];
}