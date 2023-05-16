import { Column, DataType, Table, Model, HasMany } from 'sequelize-typescript';
import { ProductDto } from '../dto/product.dto';
import { Ingridient } from 'src/ingredients/model/ingridient.model';

@Table({
  tableName: 'products',
  createdAt: false,
  updatedAt: false,
})
export class Product extends Model<Product, ProductDto> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.FLOAT,
    primaryKey: false,
    allowNull: true,
  })
  kCalPerUnit: number;

  @Column({
    type: DataType.STRING,
    primaryKey: false,
    allowNull: true,
  })
  unitOfMeasurement: string;

  @HasMany(() => Ingridient)
  recipes: Ingridient[];
}
