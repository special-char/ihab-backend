import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { Retailer, RetailerDocument } from 'src/schemas/retailers.schema';

@Injectable()
export class RetailerService {
  constructor(
    @InjectModel(Retailer.name) private retailerModel: Model<RetailerDocument>,
  ) {}

  async findAll(): Promise<Retailer[]> {
    return this.retailerModel.find().exec();
  }
  async findById(id: string): Promise<Retailer> {
    return this.retailerModel.findById(id).exec();
  }
  async create(retailer: Retailer): Promise<Retailer> {
    const newRetailer = new this.retailerModel(retailer);
    return newRetailer.save();
  }

  async assignCategories(
    categories: Category[],
    id: string,
  ): Promise<Retailer> {
    return this.retailerModel
      .findByIdAndUpdate({ _id: id }, { categories: categories }, { new: true })
      .populate('categories');
    // return newRetailer.save();
  }
}
