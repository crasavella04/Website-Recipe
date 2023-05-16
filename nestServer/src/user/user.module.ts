import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => RecipesModule),
  ],
  exports: [UserService],
})
export class UserModule {}
