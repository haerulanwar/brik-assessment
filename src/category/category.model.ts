import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from '../product/product.model';

@Table({
  timestamps: true,
  tableName: 'categories',
  freezeTableName: true,
  paranoid: true,
})
export class Category extends Model {
  @Column
  name: string;

  @HasMany(() => Product)
  products: Product[];
}
