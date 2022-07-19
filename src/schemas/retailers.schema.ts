import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document, Schema as MongoSchema } from 'mongoose';
import { User } from 'src/users/user.schema';
import { Category } from './category.schema';

export type RetailerDocument = Retailer & Document;

@Schema()
export class Retailer {

  _id: MongoSchema.Types.ObjectId

  @ApiProperty()
  @Prop({ required: true })
  registeredBusinessName: string;
  @ApiProperty()
  @Prop()
  shopDescription: string;
  @ApiProperty()
  @Prop()
  shopImage: string;
  @ApiProperty()
  @Prop()
  bannerImage: string;
  @ApiProperty()
  @Prop()
  industry: string;
  @ApiProperty()
  @Prop()
  currency: string;
  @ApiProperty()
  @Prop()
  abnOrAcn: string;
  @ApiProperty()
  @Prop()
  yelloStoreRefId: string;
  @ApiProperty()
  @Prop()
  ausPostStoreId: string;
  @ApiProperty()
  @Prop()
  storeUrl: string;
  @ApiProperty()
  @Prop()
  businessDesc: string;
  @ApiProperty()
  @Prop()
  ownerPhone: string;
  @ApiProperty()
  @Prop()
  webAddress: string;
  @ApiProperty()
  @Prop()
  isWebLive: string;
  @ApiProperty()
  @Prop({ required: true })
  country: string;
  @ApiProperty()
  @Prop({ required: true })
  address1: string;
  @ApiProperty()
  @Prop({ required: true })
  address2: string;
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
  @Prop()
  averageOrderValue: string;
  @ApiProperty()
  @Prop()
  numberOfProductsSold: string;
  @ApiProperty()
  @Prop()
  totalAnnualSales: string;
  @ApiProperty()
  @Prop()
  pointOfSale: string;
  @ApiProperty()
  @Prop()
  inventoryManagement: string;
  @ApiProperty()
  @Prop()
  haveExistingAPI: string;
  @ApiProperty()
  @Prop({ required: true })
  transactionFees: string;
  @ApiProperty()
  @Prop()
  freeExpShipping: string;
  @ApiProperty()
  @Prop()
  freeStandShipping: string;
  @ApiProperty()
  @Prop()
  freeInterShipping: string;
  @ApiProperty()
  @Prop()
  freeStandSendle: string;
  @ApiProperty()
  @Prop()
  freeInterSendle: string;
  @ApiProperty()
  @Prop()
  orderEmail: string;
  @ApiProperty()
  @Prop()
  maxReturnDays: string;
  @ApiProperty()
  @Prop()
  retailerSpecificDesc: string;
  @ApiProperty()
  @Prop()
  bankAccName: string;
  @ApiProperty()
  @Prop()
  bankName: string;
  @ApiProperty()
  @Prop()
  bsb: string;
  @ApiProperty()
  @Prop()
  accNum: string;
  @ApiProperty()
  @Prop()
  btAccManager: string;
  @ApiProperty()
  @Prop()
  sendleAPiKey: string;
  @ApiProperty()
  @Prop()
  sendleId: string;
  @ApiProperty()
  @Prop()
  sendlePlans: string;
  @ApiProperty()
  @Prop({ required: true })
  shipContries: [];
  @ApiProperty()
  @Prop()
  affiliateLink: string;
  @ApiProperty()
  @Prop()
  additionalInfo: string;
  @ApiProperty()
  @Prop()
  isOnBoard: boolean;
  @ApiProperty()
  @Prop()
  slug: string;
  @ApiProperty()
  @IsOptional()
  @Prop({
    type: [{ type: MongoSchema.Types.ObjectId, ref: () => Category }],
  })
  categories: Category;
  @ApiProperty()
  @IsOptional()
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const RetailerSchema = SchemaFactory.createForClass(Retailer);
