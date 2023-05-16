import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserDto } from './dto/user.dto';
import { RecipesService } from 'src/recipes/recipes.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @Inject(forwardRef(() => RecipesService))
    private readonly recipeService: RecipesService,
  ) {}

  async addUser(data: UserDto): Promise<number> {
    try {
      const { email, password, name, surname } = data;

      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!emailRegex.test(email)) {
        throw new HttpException(
          'Электронная почта не прошла валидацию',
          HttpStatus.BAD_REQUEST,
        );
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{8,20}$/;

      if (!passwordRegex.test(password)) {
        throw new HttpException(
          'Пароль не прошел валидацию',
          HttpStatus.BAD_REQUEST,
        );
      }

      const candidate = await this.userRepository.findOne({ where: { email } });
      if (candidate) {
        throw new HttpException('Пользователь есть', HttpStatus.CONFLICT);
      }

      const user = await this.userRepository.create(
        {
          email,
          password,
          name,
          surname,
        },
        { returning: true },
      );

      return user.id;
    } catch (error) {
      return error;
    }
  }

  async enterUser(email: string, password: string): Promise<number> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new HttpException('Пользователя нет', HttpStatus.CONFLICT);
      }

      if (user.password != password) {
        throw new HttpException('Неправильный пароль', HttpStatus.CONFLICT);
      }

      return user.id;
    } catch (error) {
      return error;
    }
  }

  async getAuthorName(id: number): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user.surname + ' ' + user.name;
    } catch (error) {
      return error;
    }
  }

  async getUserData(
    userId: number,
  ): Promise<{
    authorFullName: string;
    quantityOurRecipes: number;
    quantitySavedRecipes: number;
    ourRecipesSaved: number;
  }> {
    const fullName: string = await this.getAuthorName(userId);
    const ourRecipes: number = await this.recipeService.quantityOurRecipes(
      userId,
    );
    //вы сохранили н рецептов
    const savesRecipe: number = await this.recipeService.quantityMySaves(
      userId,
    );
    //Ваши рецепты сохранили 9 раз(а)
    const ourRecipesSaved: number =
      await this.recipeService.quantityOurRecipesWasSaved(userId);
    return {
      authorFullName: fullName,
      quantityOurRecipes: ourRecipes,
      quantitySavedRecipes: savesRecipe,
      ourRecipesSaved: ourRecipesSaved,
    };
  }
}
