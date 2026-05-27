import {  BadRequestException,  Injectable,  NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleDetail } from '../sale_details/entities/sale_detail.entity';

@Injectable()
export class SalesService {

  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saleDetailRepository: Repository<SaleDetail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createSaleDto: CreateSaleDto,
  ) {
    const user =
      await this.userRepository.findOne({
        where: {
          id: createSaleDto.userId,
        },
      });
    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    let total = 0;

    const details: SaleDetail[] = [];

    for (const item of createSaleDto.items) {

      const product =
        await this.productRepository.findOne({
          where: {
            id: item.productId,
          },
        });

      if (!product) {

        throw new NotFoundException(
          `Producto ${item.productId} no encontrado`,
        );
      }

      if (product.stock < item.quantity) {

        throw new BadRequestException(
          `Stock insuficiente para ${product.name}`,
        );
      }

      const subtotal =
        Number(product.price) * item.quantity;

      total += subtotal;

      product.stock -= item.quantity;

      await this.productRepository.save(product);

      const detail =
        this.saleDetailRepository.create({

          product,

          quantity: item.quantity,

          price: Number(product.price),

          subtotal,
        });

      details.push(detail);
    }

    const sale =
      this.saleRepository.create({

        total,

        user,

        details,
      });

    return this.saleRepository.save(sale);
  }

  findAll() {

    return this.saleRepository.find({

      relations: {
        user: true,
        details: {
          product: true,
        },
      },
    });
  }

  async findOne(id: number) {

    const sale =
      await this.saleRepository.findOne({

        where: { id },

        relations: {
          user: true,
          details: {
            product: true,
          },
        },
      });

    if (!sale) {

      throw new NotFoundException(
        'Venta no encontrada',
      );
    }

    return sale;
  }

  async remove(id: number) {

    const sale =
      await this.findOne(id);

    return this.saleRepository.remove(sale);
  }
}