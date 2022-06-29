import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  sort_order: number;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Category' })
  parent_id: Category;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
