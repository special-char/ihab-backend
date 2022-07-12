import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { User } from 'src/users/user.schema';
import { RetailerOfferStatus } from 'src/utils/types';
import { Offer } from './offers.schema';
import { Retailer } from './retailers.schema';

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

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Retailer' })
  retailer: Retailer;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Offer' })
  OfferId: Offer;

  @Prop()
  offerPrice: number;

  @Prop({
    type: String,
    required: true,
    default: RetailerOfferStatus.Pending,
    enum: [
      RetailerOfferStatus.Pending,
      RetailerOfferStatus.Accepted,
      RetailerOfferStatus.Rejected,
    ],
  })
  status: string;
}

export const RetailerOfferSchema = SchemaFactory.createForClass(RetailerOffer);
