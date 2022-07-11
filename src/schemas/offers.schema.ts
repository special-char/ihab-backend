import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import isWithinInterval from 'date-fns/isWithinInterval';
import { Document, Schema as MongoSchema } from 'mongoose';
import { User } from 'src/users/user.schema';
import { OfferStatus } from 'src/utils/types';
import { Product } from './product.schema';
import { RetailerOffer } from './retailerOffers.schema';

export type OfferDocument = Offer & Document;

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
  toObject: { virtuals: true },
})
export class Offer {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: User.name })
  userId: User;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: Product.name })
  productId: Product;

  @Prop({
    type: String,
    required: true,
    default: OfferStatus.Active,
    enum: [OfferStatus.Active, OfferStatus.Inactive],
  })
  status: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  offerStartTime: string;

  @Prop({
    type: Date,
    default: () => new Date(+new Date() + 24 * 60 * 60 * 1000),
  })
  offerEndTime: string;

  @Prop()
  customerOfferPrice: number;

  @Prop({
    type: [{ type: MongoSchema.Types.ObjectId, ref: RetailerOffer.name }],
  })
  retailerOffers: RetailerOffer[];
}

export const OfferSchema = SchemaFactory.createForClass(Offer);

// OfferSchema.virtual('isActive').get(function () {
//   return isWithinInterval(new Date(), {
//     start: new Date(this.offerStartTime),
//     end: new Date(this.offerEndTime),
//   });
// });
