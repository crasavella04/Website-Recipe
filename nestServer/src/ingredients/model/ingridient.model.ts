import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IngridientDto } from '../dto/ingridient.dto';
import { Product } from 'src/product/model/product.model';
import { Recipe } from 'src/recipes/models/recipe.model';

@Table({
  tableName: 'ingridients',
  createdAt: false,
  updatedAt: false,
})
export class Ingridient extends Model<Ingridient, IngridientDto> {
  @ForeignKey(() => Recipe)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  recipeId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Recipe)
  recipe: Recipe;
}
