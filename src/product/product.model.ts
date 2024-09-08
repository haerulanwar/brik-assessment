import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from '../category/category.model';
import { Sale } from '../sale/sale.model';

@Table({
  timestamps: true,
  tableName: 'products',
  freezeTableName: true,
  paranoid: true,
})
export class Product extends Model {
  @ForeignKey(() => Category)
  @Column
  categoryId: number;

  @Column
  sku: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  weight: number;

  @Column
  width: number;

  @Column
  length: number;

  @Column
  height: number;

  @Column
  image: string;

  @Column
  price: number;

  @Column
  qty: number;

  @BelongsTo(() => Category, {
    foreignKey: 'categoryId',
    constraints: true,
  })
  category?: Category;

  @HasMany(() => Sale)
  sales?: Sale[];
}
