import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private catModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.catModel.find().exec();
  }

  async findParent(): Promise<Category[]> {
    return this.catModel.find({ parent_id: null }).exec();
  }
}
