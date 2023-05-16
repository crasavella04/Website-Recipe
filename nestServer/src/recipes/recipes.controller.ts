import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RatingService } from './rating.service';
import { SaveRecipeDto } from './dto/savesRecipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipeService: RecipesService,
    private readonly ratingService: RatingService,
  ) {}

  @Get('')
  allRecipes() {
    return this.recipeService.getAllRecipes();
  }

  @Post('recipeItem')
  oneRecipe(@Body() data: { recipeId: number; userId: number }) {
    return this.recipeService.getOneRecipe(data.recipeId, data.userId);
  }

  @Post('create')
  createRecipe(@Body() data) {
    this.recipeService.createRecipe(
      data.authorId,
      data.title,
      data.ingridients,
      data.instruction,
    );
  }

  @Get('authorRecipes/:id')
  getAuthorRecipes(@Param('id') id: string) {
    return this.recipeService.getAllRecipes(Number(id));
  }

  @Post('likeRecipe')
  postLikeRecipe(
    @Body() data: { idRecipe: number; idUser: number; rating: number },
  ) {
    this.ratingService.putRating(data.idRecipe, data.idUser, data.rating);
  }

  @Post('saveRecipe')
  saveRecipe(@Body() data: SaveRecipeDto) {
    return this.recipeService.saveRecipe(data.userId, data.recipeId);
  }

  @Get('ourSaves/:id')
  getOurSavesRecipe(@Param('id') id: number) {
    return this.recipeService.getSavesRecipes(id);
  }
}
