import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SaleDetail } from '../../sale_details/entities/sale_detail.entity';

@Entity('products')
export class Product {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // NUEVO
  @Column()
  category!: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column()
  stock!: number;

  // NUEVO
  @Column({
    type: 'text',
  })
  description!: string;

  @OneToMany(
    () => SaleDetail,
    detail => detail.product,
  )
  saleDetails!: SaleDetail[];
}