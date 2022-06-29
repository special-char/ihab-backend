import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Document, Schema as MongoSchema } from 'mongoose';
import { Category } from './category.schema';

export type RetailerDocument = Retailer & Document;

@Schema()
export class Retailer {
  @ApiProperty()
  @Prop({ required: true })
  firstName: string;
  @ApiProperty()
  @Prop({ required: true })
  lastName: string;
  @ApiProperty()
  @Prop({ required: true })
  email: string;
  @ApiProperty()
  @Prop({ required: true })
  password: string;
  @ApiProperty()
  @Prop({ required: true })
  status: string;
  @ApiProperty()
  @Prop({ required: true })
  phone: string;
  @ApiProperty()
  @Prop({ required: true })
  bName: string;
  @ApiProperty()
  @Prop({ required: true })
  shopDesc: string;
  @ApiProperty()
  @Prop({ required: true })
  logo: string;
  @ApiProperty()
  @Prop({ required: true })
  banner: string;
  @ApiProperty()
  @Prop({ required: true })
  industry: string;
  @ApiProperty()
  @Prop({ required: true })
  currency: string;
  @ApiProperty()
  @Prop({ required: true })
  abnOrAcn: string;
  @ApiProperty()
  @Prop({ required: true })
  yelloStoreRefId: string;
  @ApiProperty()
  @Prop({ required: true })
  ausPostStoreRefId: string;
  @ApiProperty()
  @Prop({ required: true })
  storeUrl: string;
  @ApiProperty()
  @Prop({ required: true })
  busDesc: string;
  @ApiProperty()
  @Prop({ required: true })
  ownerPhone: string;
  @ApiProperty()
  @Prop({ required: true })
  webAddress: string;
  @ApiProperty()
  @Prop({ required: true })
  isWebLive: boolean;
  @ApiProperty()
  @Prop({ required: true })
  country: string;
  @ApiProperty()
  @Prop({ required: true })
  add1: string;
  @ApiProperty()
  @Prop({ required: true })
  add2: string;
  @ApiProperty()
  @Prop({ required: true })
  suburb: string;
  @ApiProperty()
  @Prop({ required: true })
  state: string;
  @ApiProperty()
  @Prop({ required: true })
  postcode: string;
  @ApiProperty()
  @Prop({ required: true })
  avgorderval: string;
  @ApiProperty()
  @Prop({ required: true })
  skuCount: string;
  @ApiProperty()
  @Prop({ required: true })
  totalSale: string;
  @ApiProperty()
  @Prop({ required: true })
  pointOfSale: string;
  @ApiProperty()
  @Prop({ required: true })
  inventoryManagement: string;
  @ApiProperty()
  @Prop({ required: true })
  haveExistingAPi: boolean;
  @ApiProperty()
  @Prop({ required: true })
  transactionFees: string;
  @ApiProperty()
  @Prop({ required: true })
  expressShipFees: string;
  @ApiProperty()
  @Prop({ required: true })
  standardRangeforFree: string;
  @ApiProperty()
  @Prop({ required: true })
  intlRangeforFree: string;
  @ApiProperty()
  @Prop({ required: true })
  sendleRangeForFree: string;
  @ApiProperty()
  @Prop({ required: true })
  orderEmail: string;
  @ApiProperty()
  @Prop({ required: true })
  maxReturnDays: string;
  @ApiProperty()
  @Prop({ required: true })
  retailerSpecificDesc: string;
  @ApiProperty()
  @Prop({ required: true })
  bankAccName: string;
  @ApiProperty()
  @Prop({ required: true })
  bankName: string;
  @ApiProperty()
  @Prop({ required: true })
  bsb: string;
  @ApiProperty()
  @Prop({ required: true })
  accNum: string;
  @ApiProperty()
  @Prop({ required: true })
  accNumbtManager: string;
  @ApiProperty()
  @Prop({ required: true })
  sendleAPiKey: string;
  @ApiProperty()
  @Prop({ required: true })
  sendleId: string;
  @ApiProperty()
  @Prop({ required: true })
  sendlePlans: string;
  @ApiProperty()
  @Prop({ required: true })
  shipContry: string;
  @ApiProperty()
  @Prop()
  affiliateLink: string;
  @ApiProperty()
  @Prop()
  additionalInfo: string;
  @ApiProperty()
  @Prop({ required: true })
  isOnBoard: boolean;
  @ApiProperty()
  @Prop({ required: true })
  slug: string;
  @ApiProperty()
  @IsOptional()
  @Prop({
    type: [{ type: MongoSchema.Types.ObjectId, ref: () => Category }],
  })
  categories: Category;
}

export const RetailerSchema = SchemaFactory.createForClass(Retailer);
