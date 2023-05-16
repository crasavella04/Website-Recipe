import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { SaveRecipeDto } from '../dto/savesRecipe.dto';
import { User } from 'src/user/models/user.model';
import { Recipe } from './recipe.model';

@Table({
  tableName: 'saveRecipes',
  createdAt: false,
  updatedAt: false,
})
export class SaveRecipe extends Model<SaveRecipe, SaveRecipeDto> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Recipe)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  recipeId: number;

  @BelongsTo(() => Recipe)
  recipe: Recipe;
}
