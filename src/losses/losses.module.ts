import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { LossesService } from './losses.service';
import { LossesController } from './losses.controller';

import { Loss } from './entities/loss.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loss, Product])],

  controllers: [LossesController],

  providers: [LossesService],
})
export class LossesModule {}