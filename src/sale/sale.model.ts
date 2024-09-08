import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../product/product.model';

@Table({
  timestamps: true,
  tableName: 'sales',
  freezeTableName: true,
  paranoid: true,
})
export class Sale extends Model {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @Column
  qty: number;

  @Column
  revenue: number;

  @BelongsTo(() => Product, {
    foreignKey: 'productId',
    constraints: true,
  })
  product?: Product;
}
