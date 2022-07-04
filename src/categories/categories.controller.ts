import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Category } from 'src/schemas/category.schema';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('/parent')
  getParentCategories(): Promise<Category[]> {
    return this.categoriesService.findParent();
  }
}
