import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ingridient } from './model/ingridient.model';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [IngredientsService],
  imports: [SequelizeModule.forFeature([Ingridient]), ProductModule],
  exports: [IngredientsService],
})
export class IngredientsModule {}
