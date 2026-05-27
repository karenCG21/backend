import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(
    createProductDto: CreateProductDto,
  ) {

    const product =
      this.productRepository.create(
        createProductDto,
      );

    return this.productRepository.save(product);
  }

  findAll() {

    return this.productRepository.find({

      relations: {
        saleDetails: true,
      },
    });
  }

  async findOne(id: number) {

    const product =
      await this.productRepository.findOne({

        where: { id },

        relations: {
          saleDetails: true,
        },
      });

    if (!product) {

      throw new NotFoundException(
        'Producto no encontrado',
      );
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ) {

    await this.productRepository.update(
      id,
      updateProductDto,
    );

    return this.findOne(id);
  }

  async remove(id: number) {

    const product =
      await this.findOne(id);

    return this.productRepository.remove(product);
  }
}