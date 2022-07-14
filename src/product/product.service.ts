import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private prodModel: Model<ProductDocument>,
  ) { }

  async findAll(query): Promise<Product[]> {
    console.log("query", query);
    if (query?.search) {
      return this.searchProducts(query?.search)
    }
    return this.prodModel.find().exec();
  }
  async findOne(id: string): Promise<Product> {
    return this.prodModel.findById(id).exec();
  }

  async findOneByBarcode(barcode: string): Promise<Product> {
    return this.prodModel.findOne({ barcode: Number(barcode) }).exec();
  }

  async findByCategories(cat_id: string): Promise<Product[]> {
    return this.prodModel.find({ categories: [cat_id] }).exec();
  }

  async searchProducts(search: string): Promise<Product[]> {
    return this.prodModel.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: search,
            $options: 'i'
          }
        }
        ,
        {
          slug: {
            $regex: search,
            $options: 'i'
          }
        }
      ]
    }).exec()
  }

  async create(product: Product): Promise<Product> {
    const dta = new this.prodModel(product);
    return dta.save();
  }
  async delete(id: string): Promise<boolean> {
    return this.prodModel.findByIdAndRemove(id);
  }

}
