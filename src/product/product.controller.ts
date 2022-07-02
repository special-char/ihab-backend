import {
  //   Body,
  Controller,
  Get,
  Param,
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

  //   @Post()
  //   @ApiBody({ type: Retailer })
  //   createRetailer(@Body() dto: RetailerDto): Promise<Retailer> {
  //     return this.productService.create(dto);
  //   }

  //   @Patch()
  //   assignCategories(@Body() dto: CatType): Promise<Retailer> {
  //     return this.retailerService.assignCategories(dto.categories, dto.id);
  //   }
}

// interface CatType {
//   id: string;
//   categories: Category[];
// }
