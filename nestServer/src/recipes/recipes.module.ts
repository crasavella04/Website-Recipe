import { Module, forwardRef } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Recipe } from './models/recipe.model';
import { Rating } from './models/rating.model';
import { UserModule } from 'src/user/user.module';
import { RatingService } from './rating.service';
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { SaveRecipe } from './models/savesRecipe.model';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RatingService],
  imports: [
    SequelizeModule.forFeature([Recipe, Rating, SaveRecipe]),
    UserModule,
    IngredientsModule,
  ],
  exports: [RecipesService],
})
export class RecipesModule {}
