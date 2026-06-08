import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { SaleDetailsModule } from './sale_details/sale_details.module';
import { AuthModule } from './auth/auth.module';
import { LossesModule } from './losses/losses.module';
import { ReportsModule } from './reports/reports.module';

import { User } from './users/entities/user.entity';
import { Sale } from './sales/entities/sale.entity';
import { SaleDetail } from './sale_details/entities/sale_detail.entity';
import { Product } from './products/entities/product.entity';
import { Loss } from './losses/entities/loss.entity';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://pi_g4uo_user:Vi7lfbqFoeYfRVsvKbwmlQZlmOyEk40X@dpg-d8bfuvvavr4c73932jgg-a.oregon-postgres.render.com/pi_g4uo',
      entities: [
        User,
        Sale,
        SaleDetail,
        Product,
        Loss,
      ],
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    UsersModule,
    ProductsModule,
    SalesModule,
    SaleDetailsModule,
    AuthModule,
    LossesModule,
    ReportsModule,
  ],
})
export class AppModule {}