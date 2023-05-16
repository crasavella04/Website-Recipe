import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productSevice: ProductService) {}

  @Get()
  getAllProduct() {
    return this.productSevice.getAllProduct();
  }
}
