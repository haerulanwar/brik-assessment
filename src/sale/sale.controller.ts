import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSaleDto } from './create-sale.dto';
import { SaleService } from './sale.service';
import { PaginatedResource } from '../helpers/pagination.dto';
import { Sale } from './sale.model';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async sale(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return await this.saleService.sale(createSaleDto);
  }

  @Get('history')
  history(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResource<Sale>> {
    return this.saleService.history(page, limit);
  }

  @Get('history/:id')
  byProduct(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResource<Sale>> {
    return this.saleService.byProduct(page, limit, id);
  }
}
