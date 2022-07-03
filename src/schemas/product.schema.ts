import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Category } from './category.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;
  @Prop({ type: MongoSchema.Types.Array, required: true })
  image: [string];
  @Prop({ required: true })
  model_sku: string;
  @Prop({ required: true })
  rrp: number;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  manufacturer: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ required: true })
  product_url: string;
  @Prop({ type: MongoSchema.Types.Map })
  specs: any;
  @Prop({ type: MongoSchema.Types.Map })
  features: any;
  @Prop({
    type: [{ type: MongoSchema.Types.ObjectId, ref: () => Category.name }],
  })
  @Type(() => Category)
  categories: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
