import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Category } from './category.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  ratings: number;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  slug: string;
  @Prop({
    type: [{ type: MongoSchema.Types.ObjectId, ref: () => Category }],
  })
  categories: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
