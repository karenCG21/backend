import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { SaleDetail } from '../sale_details/entities/sale_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      SaleDetail,
      Product,
      User,
    ]),
  ],
  controllers: [
    SalesController,
  ],
  providers: [
    SalesService,
  ],
  exports: [
    SalesService,
  ],
})
export class SalesModule {}