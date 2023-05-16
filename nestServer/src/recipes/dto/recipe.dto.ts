import { IngridientDto } from '../../ingredients/dto/ingridient.dto';

export class RecipeDto {
  id: number;
  title: string;
  authorId: number;
  authorFullName?: string;
  instruction: string;
  ingridients?: IngridientDto[];
  rating?: number;
  saved?: boolean;
  kcal?: number;
}
