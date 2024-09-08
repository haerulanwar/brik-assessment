import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create({
      ...createCategoryDto,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryModel.findOne({ where: { id } });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    await category.destroy();
  }

  async update(
    createCategoryDto: CreateCategoryDto,
    id: string,
  ): Promise<Category> {
    const category = await this.categoryModel.findOne({ where: { id } });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return await category.update(createCategoryDto);
  }
}
