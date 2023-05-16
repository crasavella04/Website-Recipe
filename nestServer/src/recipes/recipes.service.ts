import {
  Injectable,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Recipe } from './models/recipe.model';
import { RecipeDto } from './dto/recipe.dto';
import { UserService } from 'src/user/user.service';
import { RatingService } from 'src/recipes/rating.service';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { SaveRecipe } from './models/savesRecipe.model';
import { SaveRecipeDto } from './dto/savesRecipe.dto';
import { IngridientDto } from 'src/ingredients/dto/ingridient.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe) private recipeRepository: typeof Recipe,
    @InjectModel(SaveRecipe) private saveRecipeRepository: typeof SaveRecipe,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly ratingService: RatingService,
    private readonly ingredientService: IngredientsService,
  ) {}

  async getAllRecipes(
    authorId?: number,
  ): Promise<RecipeDto[] | { recipes: RecipeDto[]; authorFullName: string }> {
    let recipes: RecipeDto[];

    if (authorId) {
      recipes = await this.recipeRepository.findAll({ where: { authorId } });
    } else {
      recipes = await this.recipeRepository.findAll();
    }

    const newRecipes: Promise<RecipeDto>[] = recipes.map(async (recipe) => {
      const author: string = await this.userService.getAuthorName(
        recipe.authorId,
      );
      const rating: number = await this.ratingService.getRecipeRating(
        recipe.id,
      );

      return {
        id: recipe.id,
        title: recipe.title,
        authorId: recipe.authorId,
        authorFullName: author,
        instruction: recipe.instruction,
        rating,
      };
    });

    if (authorId) {
      const authorFullName: string = await this.userService.getAuthorName(
        authorId,
      );
      return {
        recipes: await Promise.all(newRecipes),
        authorFullName,
      };
    }

    return await Promise.all(newRecipes);
  }

  async getOneRecipe(recipeId: number, userId: number): Promise<RecipeDto> {
    const recipe: Recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });
    const ingridients: IngridientDto[] =
      await this.ingredientService.getIngredientsInOneRecipe(recipeId);
    let author: string;
    if (userId === recipe.authorId) {
      author = '';
    } else {
      author = await this.userService.getAuthorName(recipe.authorId);
    }
    const rating: number = await this.ratingService.getOneRating(userId);
    const kcal: number = await this.ingredientService.getKcal(recipe.id);
    const saved: boolean = await this.isSaved(userId, recipeId);

    const recipeWithIngridients: RecipeDto = {
      id: recipe.id,
      title: recipe.title,
      authorId: recipe.authorId,
      authorFullName: author,
      instruction: recipe.instruction,
      ingridients,
      rating,
      saved,
      kcal,
    };
    console.log(recipeWithIngridients);

    return recipeWithIngridients;
  }

  async getSavesRecipes(userId: number): Promise<RecipeDto[]> {
    const ourSaves: SaveRecipeDto[] = await this.saveRecipeRepository.findAll({
      where: { userId },
    });
    let recipes: RecipeDto[] = [];
    let recipe: RecipeDto;

    for (let i = 0; i < ourSaves.length; i++) {
      recipe = await this.recipeRepository.findOne({
        where: { id: ourSaves[i].recipeId },
      });
      let rating: number = await this.ratingService.getRecipeRating(recipe.id);
      let authorFullName: string = await this.userService.getAuthorName(
        recipe.authorId,
      );
      recipes.push({
        id: recipe.id,
        title: recipe.title,
        authorId: recipe.authorId,
        authorFullName,
        instruction: recipe.instruction,
        rating,
      });
    }

    return recipes;
  }

  async createRecipe(
    authorId: number,
    title: string,
    ingredients: IngridientDto[],
    instruction: string,
  ): Promise<void> {
    const recipe: RecipeDto = await this.recipeRepository.create(
      {
        title,
        authorId,
        instruction,
      },
      { returning: true },
    );
    await this.ingredientService.addIngredients(ingredients, recipe.id);
  }

  async saveRecipe(userId: number, recipeId: number): Promise<void> {
    const isSaved: boolean = await this.isSaved(userId, recipeId);
    if (!isSaved) {
      await this.saveRecipeRepository.create({
        userId,
        recipeId,
      });
      throw new HttpException('Рецепт сохранен', HttpStatus.CREATED);
    } else {
      await this.saveRecipeRepository.destroy({
        where: {
          userId,
          recipeId,
        },
      });
      throw new HttpException('Сохранение удалено', HttpStatus.ACCEPTED);
    }
  }

  async quantityOurRecipes(userId: number): Promise<number> {
    const recipes: RecipeDto[] = await this.recipeRepository.findAll({
      where: { authorId: userId },
    });
    return recipes.length;
  }

  async quantityOurRecipesWasSaved(userId: number): Promise<number> {
    const recipes: RecipeDto[] = await this.recipeRepository.findAll({
      where: { authorId: userId },
    });
    let quantity: number = 0;
    for (let i = 0; i < recipes.length; i++) {
      let recipeId: number = recipes[i].id;
      let savedRecipe: SaveRecipeDto[] =
        await this.saveRecipeRepository.findAll({ where: { recipeId } });
      quantity += savedRecipe.length;
    }
    return quantity;
  }

  async quantityMySaves(userId: number): Promise<number> {
    const savedRecipes: SaveRecipeDto[] =
      await this.saveRecipeRepository.findAll({ where: { userId } });
    return savedRecipes.length;
  }

  async isSaved(userId: number, recipeId: number): Promise<boolean> {
    const recipeSaved = await this.saveRecipeRepository.findOne({
      where: { userId, recipeId },
    });
    if (recipeSaved) {
      return true;
    } else {
      return false;
    }
  }
}
