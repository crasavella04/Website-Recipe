import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './model/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
  ) {}

  async getAllProduct(): Promise<string[]> {
    const allProducts: ProductDto[] = await this.productRepository.findAll();
    const products: string[] = allProducts.map((product) => product.name);
    return products;
  }

  async getKcalPerOneProductInRecipe(
    quantity: number,
    productName: string,
  ): Promise<number> {
    const product: ProductDto = await this.productRepository.findOne({
      where: { name: productName },
    });

    if (!product) {
      throw new HttpException('Такого продукта нет', HttpStatus.CONFLICT);
    }
    if (!product.kCalPerUnit) {
      return -1;
    }

    return quantity * product.kCalPerUnit;
  }

  async addProduct(name: string): Promise<void> {
    const product: ProductDto = await this.productRepository.findOne({
      where: { name },
    });
    if (!product) {
      await this.productRepository.create({
        name,
      });
    }
  }

  async getUnitOfMeasurement(name: string): Promise<string> {
    const product: ProductDto = await this.productRepository.findOne({
      where: { name },
    });
    return product.unitOfMeasurement;
  }
}
