import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Loss } from '../losses/entities/loss.entity';
import { SaleDetail } from '../sale_details/entities/sale_detail.entity';

@Injectable()
export class ProductsService {

  constructor(

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Loss)
    private lossRepository: Repository<Loss>,

    @InjectRepository(SaleDetail)
    private saleDetailRepository: Repository<SaleDetail>,
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
    try {

      // 1. Eliminar losses asociados
      await this.lossRepository.delete({
        plant: { id },
      });

      // 2. Eliminar sale_details asociados
      await this.saleDetailRepository.delete({
        product: { id },
      });

      // 3. Eliminar el producto
      const product = await this.findOne(id);
      return this.productRepository.remove(product);

    } catch (error) {

      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }
}