import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { Sale } from '../sales/entities/sale.entity';

import { Loss } from '../losses/entities/loss.entity';

@Injectable()
export class ReportsService {

  constructor(

    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,

    @InjectRepository(Loss)
    private lossRepository: Repository<Loss>,

  ) {}

  // REPORTE GENERAL
  async getReport(
    startDate?: string,
    endDate?: string,
    type?: string,
  ) {

    // OBTENER VENTAS
    let sales: any[] = [];

    // OBTENER PÉRDIDAS
    let losses: any[] = [];

    // VENTAS
    if (
      type === 'sales' ||
      !type
    ) {

      sales =
        await this.saleRepository.find();
    }

    // PÉRDIDAS
    if (
      type === 'losses' ||
      !type
    ) {

      losses =
        await this.lossRepository.find({

          relations: {
            plant: true,
            user: true,
          },

        });
    }

    // FORMATEAR VENTAS
    const formattedSales =
      sales.map((sale: any) => ({

        type: 'Venta',

        product:
          sale.product?.name ||
          sale.plant?.name ||
          'Producto',

        quantity:
          sale.quantity ||
          sale.amount ||
          0,

        date:
          sale.date ||
          new Date(),

      }));

    // FORMATEAR PÉRDIDAS
    const formattedLosses =
      losses.map((loss: any) => ({

        type: 'Pérdida',

        product:
          loss.plant?.name,

        quantity:
          loss.quantity,

        date:
          loss.date,

      }));

    // UNIR TODO
    let report = [

      ...formattedSales,

      ...formattedLosses,

    ];

    // FILTRAR FECHAS
    if (
      startDate &&
      endDate
    ) {

      report = report.filter((item) => {

        const itemDate =
          new Date(item.date);

        return (
          itemDate >=
          new Date(startDate) &&

          itemDate <=
          new Date(endDate)
        );
      });
    }

    return report;
  }
}