import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product } from './entities/product.entity';
import { Loss } from '../losses/entities/loss.entity';
import { SaleDetail } from '../sale_details/entities/sale_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Loss,
      SaleDetail,
    ]),
  ],

  controllers: [
    ProductsController,
  ],

  providers: [
    ProductsService,
  ],

  exports: [
    ProductsService,
  ],
})
export class ProductsModule {}