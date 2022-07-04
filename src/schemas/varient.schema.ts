import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Product } from './product.schema';

export type VairentDocument = Vairent & Document;

@Schema()
export class Vairent {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  description: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Product' })
  parent_id: Product;
}

export const VairentSchema = SchemaFactory.createForClass(Vairent);
