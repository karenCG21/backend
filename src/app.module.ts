import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { SaleDetailsModule } from './sale_details/sale_details.module';
import { User } from './users/entities/user.entity';
import { Sale } from './sales/entities/sale.entity';
import { SaleDetail } from './sale_details/entities/sale_detail.entity';
import { Product } from './products/entities/product.entity';
import { AuthModule } from './auth/auth.module';
import { LossesModule } from './losses/losses.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '123456789', //reemplazar por la contraseña de instalacion de mysql
      database: 'pi_db',
      entities:[User,Sale,SaleDetail,Product],
      autoLoadEntities: true,
      synchronize: true,
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