import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/schemas/product.schema';
import { get } from 'http';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  getProducts(@Query() query): Promise<Product[]> {
    return this.productService.findAll(query);
  }
  @Get(':id')
  getProduct(@Param() params): Promise<Product> {
    return this.productService.findOne(params?.id);
  }

  @Get('getProductByBarcode/:barcode')
  getProductByBarcode(@Param() params): Promise<Product> {
    return this.productService.findOneByBarcode(params?.barcode);
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

}
