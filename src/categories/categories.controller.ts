import { Controller, Get } from '@nestjs/common';
import { Category } from 'src/schemas/category.schema';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }
}
