import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document, Schema as MongoSchema } from 'mongoose';
import { User } from 'src/users/user.schema';
import { Category } from './category.schema';

export type RetailerDocument = Retailer & Document;

@Schema()
export class Retailer {
  @ApiProperty()
  @Prop({ required: true })
  registeredBusinessName: string;
  @ApiProperty()
  @Prop({ required: true })
  shopDescription: string;
  @ApiProperty()
  @Prop({ required: true })
  shopImage: string;
  @ApiProperty()
  @Prop({ required: true })
  bannerImage: string;
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
  ausPostStoreId: string;
  @ApiProperty()
  @Prop({ required: true })
  storeUrl: string;
  @ApiProperty()
  @Prop({ required: true })
  businessDesc: string;
  @ApiProperty()
  @Prop({ required: true })
  ownerPhone: string;
  @ApiProperty()
  @Prop({ required: true })
  webAddress: string;
  @ApiProperty()
  @Prop({ required: true })
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
  @Prop({ required: true })
  averageOrderValue: string;
  @ApiProperty()
  @Prop({ required: true })
  numberOfProductsSold: string;
  @ApiProperty()
  @Prop({ required: true })
  totalAnnualSales: string;
  @ApiProperty()
  @Prop({ required: true })
  pointOfSale: string;
  @ApiProperty()
  @Prop({ required: true })
  inventoryManagement: string;
  @ApiProperty()
  @Prop({ required: true })
  haveExistingAPI: string;
  @ApiProperty()
  @Prop({ required: true })
  transactionFees: string;
  @ApiProperty()
  @Prop({ required: true })
  freeExpShipping: string;
  @ApiProperty()
  @Prop({ required: true })
  freeStandShipping: string;
  @ApiProperty()
  @Prop({ required: true })
  freeInterShipping: string;
  @ApiProperty()
  @Prop({ required: true })
  freeStandSendle: string;
  @ApiProperty()
  @Prop({ required: true })
  freeInterSendle: string;
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
  btAccManager: string;
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
  shipContries: [];
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
  @ApiProperty()
  @IsOptional()
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const RetailerSchema = SchemaFactory.createForClass(Retailer);
