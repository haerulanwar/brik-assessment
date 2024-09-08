import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSaleDto } from './create-sale.dto';
import { Sale } from './sale.model';
import { PaginatedResource } from '../helpers/pagination.dto';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../product/product.model';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale)
    private readonly saleModel: typeof Sale,

    @InjectModel(Product)
    private readonly productModel: typeof Product,

    private sequelize: Sequelize,
  ) {}

  async sale(createSaleDto: CreateSaleDto): Promise<Sale> {
    const product = await this.productModel.findOne({
      where: { id: createSaleDto.productId },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    if (product.qty < createSaleDto.qty) {
      throw new BadRequestException('Product out of stock');
    }
    const transaction = await this.sequelize.transaction();
    try {
      await this.productModel.update(
        { qty: product.qty - createSaleDto.qty },
        { where: { id: product.id }, transaction },
      );
      const sale = await this.saleModel.create(
        {
          ...createSaleDto,
          revenue: product.price * createSaleDto.qty,
        },
        { transaction },
      );
      await transaction.commit();
      return sale;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async history(page = 1, limit = 10): Promise<PaginatedResource<Sale>> {
    const { rows, count } = await this.saleModel.findAndCountAll({
      offset: page > 0 ? (page - 1) * limit : 0,
      limit: limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }

  async byProduct(
    page = 1,
    limit = 10,
    productId: string,
  ): Promise<PaginatedResource<Sale>> {
    const { rows, count } = await this.saleModel.findAndCountAll({
      where: { productId },
      offset: page > 0 ? (page - 1) * limit : 0,
      limit: limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }
}
