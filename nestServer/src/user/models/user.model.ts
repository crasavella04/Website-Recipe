import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UserDto } from '../dto/user.dto';
import { Recipe } from 'src/recipes/models/recipe.model';
import { Rating } from 'src/recipes/models/rating.model';
import { SaveRecipe } from 'src/recipes/models/savesRecipe.model';

@Table({
  tableName: 'user',
  createdAt: false,
  updatedAt: false,
})
export class User extends Model<User, UserDto> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  surname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Recipe)
  recipes: Recipe[];

  @HasMany(() => Rating)
  ratedRecipes: Rating[];

  @HasMany(() => SaveRecipe)
  saveRecipes: SaveRecipe[];
}
