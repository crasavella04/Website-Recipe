import { Injectable } from '@nestjs/common';
import { IngridientDto } from './dto/ingridient.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Ingridient } from './model/ingridient.model';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingridient) private ingridientRepository: typeof Ingridient,
    private readonly productService: ProductService,
  ) {}

  async getKcal(recipeId: number): Promise<number> {
    const ingredients: IngridientDto[] =
      await this.ingridientRepository.findAll({ where: { recipeId } });

    let allKcal = 0;
    for (let i = 0; i < ingredients.length; i++) {
      const kcal: number =
        await this.productService.getKcalPerOneProductInRecipe(
          ingredients[i].quantity,
          ingredients[i].name,
        );
      if (kcal === -1) {
        return -1;
      }
      allKcal += kcal;
    }

    return allKcal;
  }

  async getIngredientsInOneRecipe(recipeId: number): Promise<IngridientDto[]> {
    let ingredients: IngridientDto[] = await this.ingridientRepository.findAll({
      where: { recipeId },
    });
    let newIngredients: IngridientDto[] = [];
    for (let i = 0; i < ingredients.length; i++) {
      let unitOfMeasurement: string =
        await this.productService.getUnitOfMeasurement(ingredients[i].name);
      newIngredients.push({
        ...ingredients[i],
        unitOfMeasurement,
      });
    }

    return newIngredients;
  }

  async addIngredients(
    ingredients: IngridientDto[],
    recipeId: number,
  ): Promise<void> {
    for (let i = 0; i < ingredients.length; i++) {
      await this.productService.addProduct(ingredients[i].name);
      await this.ingridientRepository.create({
        recipeId,
        name: ingredients[i].name,
        quantity: ingredients[i].quantity,
      });
    }
  }
}
