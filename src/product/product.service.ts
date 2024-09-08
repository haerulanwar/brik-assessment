import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './create-product.dto';
import { ResponseProductDto } from './response-product.dto';
import { Product } from './product.model';
import { PaginatedResource } from '../helpers/pagination.dto';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import {
  Filtering,
  FilterRule,
} from '../helpers/decorators/filtering-params.decorator';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,

    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId.toString(),
    );
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return await this.productModel
      .create({
        ...createProductDto,
      })
      .then((product) => {
        return {
          categoryId: product.categoryId,
          sku: product.sku,
          name: product.name,
          description: product.description,
          weight: product.weight,
          width: product.width,
          length: product.length,
          height: product.height,
          image: product.image,
          price: product.price,
          qty: product.qty,
          categoryName: category.name,
        };
      });
  }

  async findAll(
    page = 1,
    limit = 10,
    filter?: Filtering,
  ): Promise<PaginatedResource<ResponseProductDto>> {
    const where = filter ? getWhere(filter) : {};
    const { rows, count } = await this.productModel.findAndCountAll({
      where,
      offset: page > 0 ? (page - 1) * limit : 0,
      limit: limit,
      include: [Category],
    });

    const responseProducts: ResponseProductDto[] = [];
    if (rows.length > 0) {
      rows.forEach((product) => {
        responseProducts.push({
          categoryId: product.categoryId,
          sku: product.sku,
          name: product.name,
          description: product.description,
          weight: product.weight,
          width: product.width,
          length: product.length,
          height: product.height,
          image: product.image,
          price: product.price,
          qty: product.qty,
          categoryName: product.category?.name || '',
        });
      });
    }

    return {
      data: responseProducts,
      total: count,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ResponseProductDto> {
    const product = await this.productModel.findOne({
      where: {
        id,
      },
      include: [Category],
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return {
      categoryId: product.categoryId,
      sku: product.sku,
      name: product.name,
      description: product.description,
      weight: product.weight,
      width: product.width,
      length: product.length,
      height: product.height,
      image: product.image,
      price: product.price,
      qty: product.qty,
      categoryName: product.category?.name || '',
    };
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    await product.destroy();
  }

  async update(
    createProductDto: CreateProductDto,
    id: string,
  ): Promise<Product> {
    if (createProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        createProductDto.categoryId.toString(),
      );
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }
    const product = await this.productModel.findOne({
      where: { id },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return await product.update(createProductDto);
  }
}

const getWhere = (filter: Filtering) => {
  if (!filter) return {};
  if (filter.rule == FilterRule.EQUALS)
    return { [filter.property]: filter.value };
  if (filter.rule == FilterRule.LIKE)
    return { [filter.property]: { [Op.iLike]: `%${filter.value}%` } };
};
