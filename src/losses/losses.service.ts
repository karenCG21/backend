import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Loss } from './entities/loss.entity';
import { CreateLossDto } from './dto/create-loss.dto';

import { Product } from '../products/entities/product.entity';

@Injectable()
export class LossesService {
  constructor(
    @InjectRepository(Loss)
    private readonly lossRepository: Repository<Loss>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createLossDto: CreateLossDto) {
    const product = await this.productRepository.findOne({
      where: { id: createLossDto.plant_id },
    });

    if (!product) {
      throw new Error('Planta no encontrada');
    }

    // VALIDAR STOCK
    if (product.stock < createLossDto.quantity) {
      throw new Error('Stock insuficiente');
    }

    // DESCONTAR STOCK
    product.stock -= createLossDto.quantity;

    await this.productRepository.save(product);

    const loss = this.lossRepository.create({
      quantity: createLossDto.quantity,
      date: createLossDto.date,
      reason: createLossDto.reason,

      plant: {
        id: createLossDto.plant_id,
      },

      user: {
        id: createLossDto.user_id,
      },
    });

    return await this.lossRepository.save(loss);
  }

 async findAll() {
  return await this.lossRepository.find({
    relations: {
      plant: true,
      user: true,
    },
  });
}
}