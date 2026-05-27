import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('sale_details')
export class SaleDetail {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  subtotal!: number;

  @ManyToOne(
    () => Product,
    product => product.saleDetails,
    {
      eager: true,
    },
  )
  product!: Product;

  @ManyToOne(
    () => Sale,
    sale => sale.details,
    {
      onDelete: 'CASCADE',
    },
  )
  sale!: Sale;
}