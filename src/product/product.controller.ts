import {
  Body,
  //   Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  //   Patch,
  //   Post,
  // Req,
  // UploadedFiles,
} from '@nestjs/common';
// import { Category } from 'src/schemas/category.schema';
// import { FastifyFileFieldsInterceptor } from 'nest-fastify-multer';

// import { diskStorage } from 'multer';
import { ProductService } from './product.service';
import { Product } from 'src/schemas/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }
  @Get(':id')
  getProduct(@Param() params): Promise<Product> {
    return this.productService.findOne(params?.id);
  }

  @Get('/categories/:id')
  getProductsByCategories(@Param() params): Promise<Product[]> {
    return this.productService.findByCategories(params?.id);
  }

  @Post()
  createRetailer(@Body() dto: Product): Promise<Product> {
    return this.productService.create(dto);
  }

  @Delete(':id')
  deleteProduct(@Param() params): Promise<boolean> {
    return this.productService.delete(params?.id);
  }

  //   @Patch()
  //   assignCategories(@Body() dto: CatType): Promise<Retailer> {
  //     return this.retailerService.assignCategories(dto.categories, dto.id);
  //   }
}

// interface CatType {
//   id: string;
//   categories: Category[];
// }
