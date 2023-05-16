import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './model/product.model';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [SequelizeModule.forFeature([Product])],
  exports: [ProductService],
})
export class ProductModule {}
