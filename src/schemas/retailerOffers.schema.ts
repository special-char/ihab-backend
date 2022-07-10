import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { User } from 'src/users/user.schema';
import { Offer } from './offers.schema';

export type RetailerOfferDocument = RetailerOffer & Document;

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
  },
})
export class RetailerOffer {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User' })
  retailerId: User;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Offer' })
  OfferId: Offer;

  offerPrice: number;

  status: string;
}

export const RetailerOfferSchema = SchemaFactory.createForClass(RetailerOffer);
