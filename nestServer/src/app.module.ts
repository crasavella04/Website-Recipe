import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RecipesModule } from './recipes/recipes.module';
import { ProductModule } from './product/product.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      database: 'postgres',
      username: 'postgres',
      password: 'postgres',
      models: [],
      autoLoadModels: true,
    }),
    UserModule,
    RecipesModule,
    ProductModule,
    IngredientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
