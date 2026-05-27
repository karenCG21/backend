import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsService } from './reports.service';

import { ReportsController } from './reports.controller';

import { Sale } from '../sales/entities/sale.entity';

import { Loss } from '../losses/entities/loss.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      Loss,
    ]),
  ],

  controllers: [ReportsController],

  providers: [ReportsService],
})
export class ReportsModule {}
