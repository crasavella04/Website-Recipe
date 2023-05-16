import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Rating } from './models/rating.model';
import { InjectModel } from '@nestjs/sequelize';
import { ratingDto } from './dto/rating.dto';

@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating) private ratingRepository: typeof Rating) {}

  async getRating(id: number): Promise<number> {
    const ratings: ratingDto[] = await this.ratingRepository.findAll({
      where: { recipeId: id },
    });
    let middleRating = 0;
    for (let i = 0; i < ratings.length; i++) {
      middleRating += ratings[i].rating;
    }
    middleRating = middleRating / ratings.length;
    return middleRating;
  }

  async getOneRating(userId: number): Promise<number> {
    const rating: ratingDto = await this.ratingRepository.findOne({
      where: { userId },
    });
    if (rating) {
      return rating.rating;
    } else {
      return 0;
    }
  }

  async getRecipeRating(recipeId: number): Promise<number> {
    const ratings: ratingDto[] = await this.ratingRepository.findAll({
      where: { recipeId },
    });

    if (ratings.length === 0) {
      return 0;
    }

    let sumRating: number = 0;

    for (let i = 0; i < ratings.length; i++) {
      sumRating += ratings[i].rating;
    }

    return sumRating / ratings.length;
  }

  async putRating(
    idRecipe: number,
    idUser: number,
    rating: number,
  ): Promise<void> {
    try {
      const foundRating = await this.ratingRepository.findOne({
        where: {
          recipeId: idRecipe,
          userId: idUser,
        },
      });

      if (foundRating) {
        throw new HttpException('Вы уже оставили оценку', HttpStatus.CONFLICT);
      }

      await this.ratingRepository.create({
        recipeId: idRecipe,
        userId: idUser,
        rating,
      });

      throw new HttpException('Оценка добавлена', HttpStatus.OK);
    } catch (err) {
      console.log(err);
    }
  }
}
