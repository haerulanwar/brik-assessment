import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './create-product.dto';
import { ProductService } from './product.service';
import { PaginatedResource } from '../helpers/pagination.dto';
import { ResponseProductDto } from './response-product.dto';
import {
  Filtering,
  FilteringParams,
} from '../helpers/decorators/filtering-params.decorator';
import { Product } from './product.model';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    return await this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @FilteringParams(['name', 'id', 'categoryId', 'sku']) filter?: Filtering,
  ): Promise<PaginatedResource<ResponseProductDto>> {
    return this.productService.findAll(page, limit, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseProductDto | null> {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }

  @Put(':id')
  update(
    @Body() UpdateUser: CreateProductDto,
    @Param('id') id: string,
  ): Promise<Product> {
    return this.productService.update(UpdateUser, id);
  }
}
