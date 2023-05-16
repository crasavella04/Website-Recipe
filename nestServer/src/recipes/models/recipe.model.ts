import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { RecipeDto } from '../dto/recipe.dto';
import { User } from 'src/user/models/user.model';
import { Ingridient } from 'src/ingredients/model/ingridient.model';
import { Rating } from './rating.model';
import { SaveRecipe } from './savesRecipe.model';

@Table({
  tableName: 'recipes',
  createdAt: false,
  updatedAt: false,
})
export class Recipe extends Model<Recipe, RecipeDto> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  authorId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  instruction: string;

  @HasMany(() => Ingridient)
  ingridients: Ingridient[];

  @HasMany(() => Rating)
  ratedRecipes: Rating[];

  @HasMany(() => SaveRecipe)
  saveRecipes: SaveRecipe[];
}
