import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ratingDto } from '../dto/rating.dto';
import { Recipe } from './recipe.model';
import { User } from 'src/user/models/user.model';

@Table({
  tableName: 'ratings',
  createdAt: false,
  updatedAt: false,
})
export class Rating extends Model<Rating, ratingDto> {
  @ForeignKey(() => Recipe)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  recipeId: number;

  @BelongsTo(() => Recipe)
  recipe: Recipe;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;
}
