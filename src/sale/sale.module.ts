import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sale } from './sale.model';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { Product } from '../product/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Sale, Product])],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
